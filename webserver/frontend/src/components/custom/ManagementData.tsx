import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { CustomModal } from "@/components";
import { format } from "date-fns";

export type Management = {
  id: string;
  plate: string;
  imageIn: string;
  imageOut: string | null;
  checkIn: string;
  checkOut: string | null;
  // slot: string | null;
  // area: string | null;
  totalPayment: number;
  status: "parking" | "completed" | "pending";
};

export const columnsManagement: ColumnDef<Management>[] = [
  {
    accessorKey: "plate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          License Plate
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-base font-medium text-center">
        {row.getValue("plate")}
      </div>
    ),
  },
  {
    accessorKey: "checkIn",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full ml-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Check In
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-medium truncate">
        {format(new Date(row.getValue("checkIn")), "yyyy-MM-dd HH:mm")}
      </div>
    ),
  },
  {
    accessorKey: "checkOut",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Check Out
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("checkOut")
          ? format(new Date(row.getValue("checkOut")), "yyyy-MM-dd HH:mm")
          : "N/A"}
      </div>
    ),
  },
  // {
  //   accessorKey: "slot",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         className="w-full ml-2"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Slot
  //         <ChevronsUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <div className="text-center font-medium">
  //       {row.getValue("slot") || "N/A"}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full ml-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="w-full text-center">
        <span
          className={` px-2 py-1 text-xs font-medium rounded-full ${
            row.getValue("status") === "completed"
              ? "bg-green-100 text-green-800"
              : row.getValue("status") === "parking"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.getValue("status")}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const ParkingCell = () => {
        const parking = row.original;
        const [open, setOpen] = useState<boolean>(false);

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Parking</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(parking.plate)}
                >
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  View information
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <CustomModal open={open} onClose={() => setOpen(false)}>
              <div
                className={`${
                  parking.imageOut
                    ? "flex flex-col gap-y-4"
                    : "flex flex-row-reverse gap-x-2"
                }`}
              >
                <div className={`${parking.imageOut ? "space-y-2" : "w-1/2"}`}>
                  <h2 className="text-2xl font-bold tracking-wider">
                    {parking.plate}
                  </h2>
                  <hr className="my-3 border-slate-200 dark:border-slate-700" />
                  <div className="flex flex-col gap-y-2">
                    <p className="text-base font-medium">
                      Status:
                      <span className="ml-2 text-sm text-slate-400">
                        {parking.status}
                      </span>
                    </p>
                    {parking.checkOut ? (
                      <></>
                    ) : (
                      <p className="text-base font-medium">
                        Check In:
                        <span className="ml-2 text-sm text-slate-400">
                          {format(
                            new Date(parking.checkIn),
                            "yyyy-MM-dd HH:mm"
                          )}
                        </span>
                      </p>
                    )}
                    <p className="text-base font-medium">
                      Total Payment:
                      <span className="ml-2 text-sm text-slate-400">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(parking.totalPayment)}
                      </span>
                    </p>
                  </div>
                </div>
                <div
                  className={`${
                    parking.imageOut
                      ? "flex items-center justify-center gap-x-2"
                      : "w-1/2"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={parking.imageIn}
                      alt={parking.plate}
                      className="w-full h-full object-contain rounded-md"
                    />
                    {parking.checkOut ? (
                      <p className="text-base font-medium">
                        Check In:
                        <span className="ml-2 text-sm text-slate-400">
                          {format(
                            new Date(parking.checkIn),
                            "yyyy-MM-dd HH:mm"
                          )}
                        </span>
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>

                  {parking.imageOut && (
                    <div className="flex flex-col items-center">
                      <img
                        src={parking.imageOut}
                        alt={parking.plate}
                        className="w-full h-full object-contain rounded-md"
                      />
                      <p className="text-base font-medium">
                        Check Out:
                        <span className="ml-2 text-sm text-slate-400">
                          {parking.checkOut
                            ? format(
                                new Date(parking.checkOut),
                                "yyyy-MM-dd HH:mm"
                              )
                            : "N/A"}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CustomModal>
          </>
        );
      };

      return (
        <div className="flex items-center justify-center">
          <ParkingCell />
        </div>
      );
    },
  },
];
