import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { columnsPayment, Payment } from "@/components/";

const data: Payment[] = [
  {
    id: "m5gr84i9",
    name: "Monserrat",
    email: "ken99@yahoo.com",
    date: "2021-10-01",
    amount: 1000,
    status: "Success",
  },
  {
    id: "3u1reuv4",
    name: "Silas",
    email: "Abe45@gmail.com",
    date: "2021-10-02",
    amount: 2000,
    status: "Pending",
  },
  {
    id: "derv1ws0",
    name: "Carmella",
    email: "Monserrat44@gmail.com",
    date: "2021-10-12",
    amount: 3000,
    status: "Failed",
  },
  {
    id: "2v3d4f5",
    name: "Luna",
    email: "Luna@gmail.com",
    date: "2021-10-22",
    amount: 2500,
    status: "Pending",
  },
  {
    id: "a1v2d3f4",
    name: "Abe",
    email: "Abe@gmail.com",
    date: "2021-9-02",
    amount: 4000,
    status: "Pending",
  },
  {
    id: "v1d2f3g4",
    name: "Oscar",
    email: "Oscar@gmail.com",
    date: "2021-7-22",
    amount: 3500,
    status: "Success",
  },
  {
    id: "v1d2f3g4",
    name: "Oscar",
    email: "Oscar@gmail.com",
    date: "2021-7-22",
    amount: 3500,
    status: "Pending",
  },
  {
    id: "p1o2i3u4",
    name: "Pablo",
    email: "Pablo@gmail.com",
    date: "2021-7-20",
    amount: 5555,
    status: "Failed",
  },
  {
    id: "m1n2b3v4",
    name: "Xavier",
    email: "Xavier@gmail.com",
    date: "2021-7-14",
    amount: 3999,
    status: "Pending",
  },
  {
    id: "z1x2c3v4",
    name: "Zach",
    email: "Zach@gmail.com",
    date: "2021-7-22",
    amount: 3500,
    status: "Success",
  },
];

const PaymentTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns: columnsPayment,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  React.useEffect(() => {
    table.setPagination(pagination);
  }, [pagination, table]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-x-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsPayment.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;
