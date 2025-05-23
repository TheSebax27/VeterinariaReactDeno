import React from 'react';
import './Table.css';

interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No hay datos disponibles'
}: TableProps<T>) {
  if (loading) {
    return <div className="table-loading">Cargando...</div>;
  }

  if (data.length === 0) {
    return <div className="table-empty">{emptyMessage}</div>;
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key as string}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key as string}>
                  {column.render
                    ? column.render(record[column.key as keyof T], record)
                    : record[column.key as keyof T]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}