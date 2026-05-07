import * as XLSX from 'xlsx';

export const downloadExcel = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;

  const normalize = (value: any) => {
    if (value === null || value === undefined) return '';

    if (value instanceof Date) return value;

    if (typeof value === 'string') {
      return value
        .normalize('NFC')
        .replace(/\u00A0/g, ' ')
        .trim();
    }

    return value;
  };

  const cleanData = data.map(row => {
    const newRow: any = {};
    Object.keys(row).forEach(key => {
      newRow[key] = normalize(row[key]);
    });
    return newRow;
  });

  // 📄 Crear hoja
  const worksheet = XLSX.utils.json_to_sheet(cleanData, {
    cellDates: true
  });

  const headers = Object.keys(cleanData[0]);

  // 🔥 Rango completo
  const range = XLSX.utils.decode_range(worksheet['!ref']!);

  // ✅ 1. Autofiltro (esto lo hace "tabla usable")
  worksheet['!autofilter'] = {
    ref: XLSX.utils.encode_range(range)
  };

  // ✅ 2. Congelar header
  worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

  // ✅ 3. Ancho de columnas (mejorado)
  const colWidths = headers.map(key => ({
    wch: Math.max(
      key.length,
      ...cleanData.map(row => String(row[key] || '').length)
    ) + 2
  }));

  worksheet['!cols'] = colWidths;

  // ✅ 4. (Opcional pero PRO) formato de fechas automático
  headers.forEach((key, colIndex) => {
    const isDateColumn = cleanData.some(row => row[key] instanceof Date);

    if (isDateColumn) {
      for (let rowIndex = 1; rowIndex <= range.e.r; rowIndex++) {
        const cellAddress = XLSX.utils.encode_cell({
          r: rowIndex,
          c: colIndex
        });

        if (worksheet[cellAddress]) {
          worksheet[cellAddress].z = 'dd/mm/yyyy hh:mm';
        }
      }
    }
  });

  // 📘 Workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};