import { TicketPriority } from "../../models/ticket-priority";

export interface UpdateTicketDto {
  title: string;
  description: string;
  priority: TicketPriority;
}