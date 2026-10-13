import { TicketPriority } from "../../models/ticket-priority";

export interface CreateTicketDto {
  title: string;
  description: string;
  priority: TicketPriority;
}