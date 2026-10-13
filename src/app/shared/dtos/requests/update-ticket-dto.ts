import { TicketPriority } from "../../models/ticket-priority";
import { TicketStatus } from "../../models/ticket-status";

export interface UpdateTicketDto {
  title: string;
  description: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedAgentId?: number | null;
}