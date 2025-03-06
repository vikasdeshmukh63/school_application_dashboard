import React from 'react';

// column type
interface Column {
  header: string;
  accessor: string;
  className?: string;
}

// table props
interface TableProps {
  columns: Column[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}

// table componnent
const Table = ({ columns, renderRow, data }: TableProps) => {
  return (
    <table className="w-full mt-4">
      {/* table header */}
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map(col => (
            <th key={col.accessor} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      {/* table body */}
      <tbody>{data.map(item => renderRow(item))}</tbody>
    </table>
  );
};

export default Table;
