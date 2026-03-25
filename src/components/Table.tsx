import React from 'react';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: unknown, item: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export function Table<T>({
  columns,
  data,
  rowKey,
  actions,
  emptyMessage = 'No data available',
  emptyIcon,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/40 shadow-lg shadow-blue-900/5">
        <div className="px-6 py-16 text-center">
          {emptyIcon && (
            <div className="mb-4 flex justify-center opacity-40">{emptyIcon}</div>
          )}
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/40 shadow-lg shadow-blue-900/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100/80 dark:border-slate-700/50">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3.5 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider ${column.className ?? ''}`}
                >
                  {column.label}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60 dark:divide-slate-700/30">
            {data.map((item) => (
              <tr
                key={String(item[rowKey])}
                className="hover:bg-blue-50/40 dark:hover:bg-slate-700/30 transition-colors duration-150"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-6 py-4 text-sm text-slate-700 dark:text-slate-300 ${column.className ?? ''}`}
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key])}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 text-right">{actions(item)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
