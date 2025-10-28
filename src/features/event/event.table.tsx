"use client";

import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { ArrowRight, BadgeIcon, Calendar, MapPinIcon, Ticket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getAllEvents } from "./event.action";
import { EventFormModalButton } from "./event.form";

// Simple type from the actual function return
type EventWithContributors = NonNullable<Awaited<ReturnType<typeof getAllEvents>>["data"]>[0];

interface AdminEventsTableProps {
   events: EventWithContributors[];
}

export function AdminEventsTable({ events }: AdminEventsTableProps) {
   const [page, setPage] = useState(1);
   const [rowsPerPage, setRowsPerPage] = useState(20);

   // Sort blogs by published date in descending order (newest first)
   const sortedEvents = [...events].sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA;
   });

   const paginatedData = sortedEvents.slice((page - 1) * rowsPerPage, page * rowsPerPage);
   const totalPages = Math.ceil(sortedEvents.length / rowsPerPage);

   return (
      <div className="w-full space-y-4">
         {/* Table */}
         <div className="rounded-md border">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="pl-3">Event Name</TableHead>
                     <TableHead className="w-[150px] text-center">Start Date</TableHead>
                     <TableHead className="w-[150px] text-center">End Date</TableHead>
                     <TableHead className="w-[150px] text-center">Location</TableHead>
                     <TableHead className="w-[150px] text-center">Event Type</TableHead>
                     <TableHead className="w-[150px] text-center">Ticket Type</TableHead>
                     <TableHead className="w-[110px] text-center">Actions</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {paginatedData.map((event: EventWithContributors) => {
                     const eventtId = event.id || "";
                     return (
                        <TableRow key={eventtId} className="hover:bg-muted/50">
                           <TableCell className="group w-40 overflow-hidden">
                              <Link
                                 href={`/events/${event.slug}`}
                                 className="group flex items-center space-x-2 pl-1"
                              >
                                 <div className="w-90 font-medium text-wrap text-blue-600 hover:text-blue-700">
                                    {event.name || "Untitled"}
                                 </div>
                                 <ArrowRight className="relative -top-2 -left-1 h-3 w-3 rotate-[-45deg] text-blue-600 transition-all duration-150 group-hover:-top-2.5 group-hover:-left-0.5 hover:text-blue-700" />
                              </Link>
                           </TableCell>
                           <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                 <Calendar className="h-4 w-4 text-gray-500" />
                                 <span className="text-[13px]">
                                    {formatDate(event.startDate ? new Date(event.startDate) : null)}
                                 </span>
                              </div>
                           </TableCell>
                           <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                 <Calendar className="h-4 w-4 text-gray-500" />
                                 <span className="text-[13px]">
                                    {formatDate(event.endDate ? new Date(event.endDate) : null)}
                                 </span>
                              </div>
                           </TableCell>
                           <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                 <MapPinIcon className="h-4 w-4 text-gray-500" />
                                 <span className="text-[13px]">{event.location || "N/A"}</span>
                              </div>
                           </TableCell>
                           <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                 <BadgeIcon className="h-4 w-4 text-gray-500" />
                                 <span className="text-[13px] capitalize">
                                    {event.eventType || "N/A"}
                                 </span>
                              </div>
                           </TableCell>
                           <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                 <Ticket className="h-4 w-4 text-gray-500" />
                                 <span className="text-[13px] capitalize">
                                    {event.ticketType || "N/A"}
                                 </span>
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center justify-start gap-2">
                                 <EventFormModalButton
                                    mode="update"
                                    defaultValues={{
                                       id: event.id,
                                       name: event.name,
                                       description: event.description,
                                       startDate: event.startDate,
                                       endDate: event.endDate,
                                       location: event.location,
                                       eventType: event.eventType,
                                       ticketType: event.ticketType,
                                       coverImageUrl: event.coverImageUrl ?? undefined,
                                       imageUrl: event.imageUrl,
                                       contributors: event.contributors || [],
                                       createdAt: event.createdAt,
                                       updatedAt: event.updatedAt,
                                    }}
                                 />
                                 <EventFormModalButton
                                    mode="delete"
                                    defaultValues={{
                                       id: event.id,
                                       name: event.name,
                                       description: event.description,
                                       startDate: event.startDate,
                                       endDate: event.endDate,
                                       location: event.location,
                                       eventType: event.eventType,
                                       ticketType: event.ticketType,
                                       coverImageUrl: event.coverImageUrl ?? undefined,
                                       imageUrl: event.imageUrl,
                                       createdAt: event.createdAt,
                                       updatedAt: event.updatedAt,
                                    }}
                                 />
                              </div>
                           </TableCell>
                        </TableRow>
                     );
                  })}
               </TableBody>
            </Table>
         </div>

         {/* Pagination */}
         <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
               <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(value) => setRowsPerPage(parseInt(value))}
               >
                  <SelectTrigger className="w-[100px]">
                     <SelectValue placeholder="Rows per page" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="10">10</SelectItem>
                     <SelectItem value="20">20</SelectItem>
                     <SelectItem value="50">50</SelectItem>
                  </SelectContent>
               </Select>
               <span className="text-[13px]">
                  Page {page} of {totalPages}
               </span>
               <div className="flex gap-1">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setPage(1)}
                     disabled={page === 1}
                  >
                     «
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setPage((p) => Math.max(1, p - 1))}
                     disabled={page === 1}
                  >
                     ‹
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                     disabled={page === totalPages}
                  >
                     ›
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setPage(totalPages)}
                     disabled={page === totalPages}
                  >
                     »
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
