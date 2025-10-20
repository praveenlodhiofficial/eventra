import { EventType, Roles, TicketType } from "@/generated/prisma";

//  not used in auth.action.ts
export interface User {
   id: string;
   name: string;
   email: string;
   password: string;
   role: Roles;
   feedBack: FeedBack[];
   calendar: Calendar[];
   createdAt: Date;
   updatedAt: Date;
}

export interface Event {
   id: string;
   name: string;
   description: string;
   startDate: Date;
   endDate: Date;
   location: string;
   createdAt: Date;
   updatedAt: Date;
   eventType: EventType;
   ticketType: TicketType;
   feedback: FeedBack[];
   ticket: Ticket[];
   calendar: Calendar[];
}

export interface Ticket {
   id: string;
   eventId: string;
   event: Event;
   ticketType: TicketType;
   price: number;
   quantity: number;
   createdAt: Date;
   updatedAt: Date;
}

export interface FeedBack {
   id: string;
   eventId: string;
   event: Event;
   userId: string;
   user: User;
   feedback: string;
   createdAt: Date;
   updatedAt: Date;
}

export interface Calendar {
   id: string;
   eventId: string;
   event: Event;
   userId: string;
   user: User;
   createdAt: Date;
   updatedAt: Date;
}
