export type CreateBookingInput = {
  userId: string;
  eventId: string;
  items: { ticketTypeId: string; quantity: number }[];
};
