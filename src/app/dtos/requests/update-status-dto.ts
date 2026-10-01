import { TicketStatus } from "../../models/ticket-status";

export interface UpdateStatusDto {
  status: TicketStatus;
}