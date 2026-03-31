export const Table = ({
  headers = [],
  data = [],
  onRowClick,
  striped = false,
  hover = true,
  responsive = true,
  className = '',
}) => {
  const TableContent = (
    <table className={`table ${striped ? 'table-striped' : ''} ${hover ? 'table-hover' : ''} ${className}`}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={headers.length} className="text-center text-muted py-4">
              No hay datos disponibles
            </td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  if (responsive) {
    return <div className="table-responsive">{TableContent}</div>;
  }

  return TableContent;
};

export const DataTable = ({
  columns = [],
  data = [],
  onRowClick,
  className = '',
}) => {
  return (
    <div className="table-responsive">
      <table className={`table table-hover ${className}`}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col" style={{ width: column.width, color: 'var(--bs-body-color)' }}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted py-4">
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} style={{ color: 'var(--bs-body-color)' }}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
