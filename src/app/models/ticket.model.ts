import { TicketPriority } from "./ticket-priority";
import { TicketStatus } from "./ticket-status";

export interface Ticket {
  id?: number;
  title: string;
  description: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  aiAnalysis?: string;
  createdById: number;
  createdByName?: string;
  assignedAgentId?: number | null;
  assignedAgentName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}