import * as React from "react"
import { cn } from "../../lib/utils"

export interface Column<T> {
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string | number
  className?: string
  emptyMessage?: string
}

export function DataTable<T>({ 
  data, 
  columns, 
  keyExtractor, 
  className,
  emptyMessage = "No data available."
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-auto rounded-md border", className)}>
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {columns.map((col, i) => (
              <th 
                key={i} 
                className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-muted-foreground h-24">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr 
                key={keyExtractor(item)} 
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {columns.map((col, i) => (
                  <td 
                    key={i} 
                    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", col.className)}
                  >
                    {col.cell ? col.cell(item) : (col.accessorKey ? item[col.accessorKey] as React.ReactNode : null)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
