import { Fragment, useState, useMemo, useEffect, useCallback } from 'react';
import DataTable, { type DataTableColumn } from '@/components/DataTable';
import { reportService } from '@/api/services/reportService';
import Loading from '@/components/Loading';
import { Icon } from '@/icons/Icon';

interface UserHourData {
  user_login: string;
  user_name: string;
  hours: Record<string, number>;
  total_user: number;
}

const CellText = ({ value, className = '', refreshKey }: { value?: string | number; className?: string; refreshKey?: number }) => {
  const displayValue = value === undefined || value === null || value === '' ? '-' : String(value);
  const showTooltip = displayValue !== '-';
  
  return (
    <span
      // Al usar el valor como key, forzamos a Bootstrap a reinicializar el tooltip si el número cambia
      key={`${displayValue}-${refreshKey}`}
      className={`cell-text ${className}`}
      data-bs-toggle={showTooltip ? 'tooltip' : undefined}
      title={showTooltip ? displayValue : undefined}
    >
      {displayValue}
    </span>
  );
};

interface HourlyTabProps {
  refreshKey: number;
}

export default function HourlyTab({ refreshKey }: HourlyTabProps) {
  const [rawData, setRawData] = useState<UserHourData[]>([]);
  const [totalOffers, setTotalOffers] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const res = await reportService.getManagedByHour();
      setRawData(res.data?.data || []);
      setTotalOffers(res.data?.total_offers || 0); 
    } catch (error) {
      console.error(error);
      setRawData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport, refreshKey]);

  const hourlyTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (let i = 6; i <= 21; i++) totals[i] = 0;
    rawData.forEach(user => {
      Object.entries(user.hours).forEach(([hour, count]) => {
        if (totals[hour] !== undefined) totals[hour] += count;
      });
    });
    return totals;
  }, [rawData]);

  const columns: DataTableColumn[] = useMemo(() => {
    const base: DataTableColumn[] = [{ header: 'Asesor' }];
    const hourCols = Array.from({ length: 16 }, (_, i) => {
      const h = i + 6;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayHour = h > 12 ? h - 12 : h;
      return { header: `${displayHour} ${ampm}` };
    });
    return [...base, ...hourCols, { header: 'Total' }];
  }, []);

  return (
    <>
      {loading && <Loading fullScreen text="Cargando..." />}
      
      <DataTable<UserHourData>
        rows={rawData}
        columns={columns}
        tooltipDeps={[rawData, searchQuery, refreshKey, totalOffers]}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        getSearchText={(row) => `${row.user_login} ${row.user_name}`}
        pageSize={50}
        renderRow={(row) => (
          // Usamos refreshKey en la key del Fragment para recrear la fila completa al refrescar
          <Fragment key={`${row.user_login}-${refreshKey}`}>
            <tr>
              <td>
                <Icon name="user-call" size="lg" className="me-0" />
                <span 
                  key={`login-${row.user_login}-${refreshKey}`}
                  className="badge text-bg-blue" 
                  data-bs-toggle="tooltip" 
                  title={row.user_name}
                >
                  {row.user_login || '-'}
                </span>
              </td>
              {Array.from({ length: 16 }, (_, i) => {
                const hour = i + 6;
                const val = row.hours[hour] || 0;
                return (
                  <td key={hour}>
                    <CellText 
                      value={val === 0 ? '-' : val} 
                      className="text-muted" 
                      refreshKey={refreshKey}
                    />
                  </td>
                );
              })}
              <td 
                key={`total-user-${row.total_user}-${refreshKey}`}
                className="table-active fw-bold text-primary" 
                data-bs-toggle="tooltip" 
                title={String(row.total_user)}
              >
                {row.total_user}
              </td>
            </tr>

            {rawData.indexOf(row) === rawData.length - 1 && (
              <tr className="table-light fw-bold">
                <td className="text-center ps-3">TOTAL</td>
                {Array.from({ length: 16 }, (_, i) => {
                  const hour = i + 6;
                  const sum = hourlyTotals[hour];
                  return (
                    <td key={`total-col-${hour}`}>
                      <CellText value={sum === 0 ? '-' : sum} refreshKey={refreshKey} />
                    </td>
                  );
                })}
                <td 
                  key={`footer-total-${totalOffers}-${refreshKey}`}
                  className="table-primary text-primary fw-bold" 
                  data-bs-toggle="tooltip" 
                  title={String(totalOffers)}
                >
                  {totalOffers}
                </td>
              </tr>
            )}
          </Fragment>
        )}
      />
    </>
  );
}