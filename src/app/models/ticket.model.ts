import { TicketPriority } from "./ticket-priority";
import { TicketStatus } from "./ticket-status";

export interface Ticket {
  id?: number;
  title: string;
  description: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  aiAnalysis?: string;
  createdAt?: string;
  updatedAt?: string;
}