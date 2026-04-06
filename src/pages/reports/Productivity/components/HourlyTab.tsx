import { Fragment, useState, useMemo, useEffect, useCallback } from 'react';
import DataTable, { type DataTableColumn } from '@/components/DataTable';
import { reportService } from '@/api/services/reportService';
import Loading from '@/components/Loading';

interface UserHourData {
  user_login: string;
  user_name: string;
  hours: Record<string, number>;
  total_user: number;
}

const CellText = ({ value, className = '' }: { value?: string | number; className?: string }) => {
  const displayValue = value === undefined || value === null || value === '' ? '-' : String(value);
  const showTooltip = displayValue !== '-';
  return (
    <span
      className={`cell-text ${className}`}
      data-bs-toggle={showTooltip ? 'tooltip' : undefined}
      title={showTooltip ? displayValue : undefined}
    >
      {displayValue}
    </span>
  );
};

// Definimos la interfaz de las props para que TypeScript no de error
interface HourlyTabProps {
  refreshKey: number;
}

export default function HourlyTab({ refreshKey }: HourlyTabProps) {
  const [rawData, setRawData] = useState<UserHourData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const res = await reportService.getManagedByHour();
      setRawData(res.data?.data || []);
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
        tooltipDeps={[rawData, searchQuery, refreshKey]}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        getSearchText={(row) => `${row.user_login} ${row.user_name}`}
        pageSize={20}
        renderRow={(row) => (
          <Fragment key={row.user_login}>
            <tr>
              <td>
                <span className="badge text-bg-blue" data-bs-toggle="tooltip" title={row.user_name}>
                  {row.user_login || '-'}
                </span>
              </td>
              {Array.from({ length: 16 }, (_, i) => {
                const hour = i + 6;
                const val = row.hours[hour] || 0;
                return (
                  <td key={hour}>
                    <CellText value={val === 0 ? '-' : val} className="text-muted" />
                  </td>
                );
              })}
              <td className="table-active fw-bold text-primary" data-bs-toggle="tooltip" title={`${row.total_user}`}>{row.total_user}</td>
            </tr>
          </Fragment>
        )}
      />
    </>
  );
}