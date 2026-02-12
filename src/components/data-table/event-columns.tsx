"use client";

import Link from "next/link";

import { IconArrowUpRight } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

import { DeleteModal } from "@/components/modals/delete.modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventSummary } from "@/domains/event/event.schema";
import { DeleteModalType } from "@/types/delete.types";

export const eventColumns: ColumnDef<EventSummary>[] = [
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
    cell: ({ row }) => {
      const slug = row.original.slug;
      const name = row.getValue("name") as string;

      return (
        <Link
          href={`/admin/events/${slug}`}
          className="group relative font-medium text-blue-600"
        >
          <span className="truncate">{name}</span>
          <IconArrowUpRight className="absolute -top-2.5 -right-3.5 h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
        </Link>
      );
    },
  },
  {
    accessorKey: "venueId",
    header: "Venue",
    cell: ({ row }) => {
      const venue = row.original.venueId;
      const city = row.original.city;

      return `${venue}, ${city}`;
    },
  },
  {
    id: "date",
    header: "Date",
    cell: ({ row }) => {
      const start = new Date(row.original.startAt);
      const end = new Date(row.original.endAt);

      const sameDay = format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd");

      if (sameDay) {
        return format(start, "dd MMM yyyy");
      }

      return `${format(start, "dd MMM")} → ${format(end, "dd MMM yyyy")}`;
    },
  },

  {
    id: "time",
    header: "Time",
    cell: ({ row }) => {
      const start = new Date(row.original.startAt);
      const end = new Date(row.original.endAt);

      return `${format(start, "p")} → ${format(end, "p")}`;
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge variant="default">{status}</Badge>;
    },
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
            <DropdownMenuItem asChild>
              <Link href={`/admin/events/${row.original.slug}`}>
                View Event
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Event</DropdownMenuItem>
            <DeleteModal
              type={DeleteModalType.EVENT}
              id={row.original.id}
              trigger="text"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
