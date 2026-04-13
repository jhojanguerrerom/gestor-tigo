export const downloadCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  // 1. Obtener los encabezados (las llaves del primer objeto)
  const headers = Object.keys(data[0]).join(';');

  // 2. Mapear las filas usando punto y coma como separador
  const rows = data.map(row => 
    Object.values(row)
      .map(value => {
        // Limpiamos el valor: si es null/undefined ponemos vacío, 
        // y convertimos a string para evitar errores
        const strValue = value !== null && value !== undefined ? String(value) : '';
        // Envolvemos en comillas para que si el texto tiene un punto y coma, no rompa la celda
        return `"${strValue.replace(/"/g, '""')}"`; 
      })
      .join(';')
  );

  /**
   * 3. El Truco Maestro: 
   * 'sep=;' le dice a Excel que el separador es el punto y coma.
   * El BOM (\uFEFF) asegura que reconozca tildes y eñes correctamente.
   */
  const csvContent = `sep=;\n${headers}\n${rows.join('\n')}`;
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  
  // 4. Crear el link de descarga
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};