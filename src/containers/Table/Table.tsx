import React from "react";

export interface TableColumn<T> {
  key: string;
  label: React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  loadingMessage?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  rowKeyField?: keyof T;
  onRowClick?: (item: T, index: number) => void;
  headerClassName?: string;
  rowClassName?: (item: T, index: number) => string;
  containerClassName?: string;
}

const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  loadingMessage = "Loading data...",
  emptyMessage = "No data available",
  rowKeyField = "id",
  onRowClick,
  headerClassName = "bg-[#BBF429] text-[#1A1A1A]",
  rowClassName,
  containerClassName,
}: TableProps<T>) => {
  const getRowKey = (item: T, index: number) => {
    return item[rowKeyField]?.toString() || `row-${index}`;
  };

  const defaultRowClassName = () => {
    return "hover:bg-[#2A2A2A] " + (onRowClick ? "cursor-pointer" : "");
  };

  return (
    <div className={`overflow-x-auto ${containerClassName}`}>
      <table className="w-full bg-[#1A1A1A] text-white rounded-lg overflow-hidden shadow-lg">
        <thead className={headerClassName}>
          <tr className="text-left text-sm md:text-base">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`py-3 px-4 ${column.className || ""}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#BBF429]">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-10">
                {loadingMessage}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-10">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={getRowKey(item, index)}
                className={
                  rowClassName
                    ? rowClassName(item, index)
                    : defaultRowClassName()
                }
                onClick={() => onRowClick && onRowClick(item, index)}
              >
                {columns.map((column) => (
                  <td
                    key={`${getRowKey(item, index)}-${column.key}`}
                    className="py-4 px-4"
                  >
                    {column.render
                      ? column.render(item, index)
                      : item[column.key] !== undefined
                      ? (item[column.key] as React.ReactNode)
                      : null}
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

export default Table;
