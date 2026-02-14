"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TicketType } from "@/domains/ticket-type/ticket-type.schema";

import { TicketTypeModal } from "../modals/ticket-type/ticket-type-modal";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export const ticketTypeColumns: ColumnDef<TicketType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <TicketTypeModal
                eventId={row.original.eventId}
                mode="update"
                ticketType={{
                  id: row.original.id!,
                  name: row.original.name,
                  price: row.original.price,
                  quantity: row.original.quantity,
                }}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DeleteModal type="ticketType" id={row.original.id} /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
