import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../models/ticket.model';
import { TicketStatus } from '../../models/ticket-status';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service'; // <--- Import du UserService
import { CreateTicketDto } from '../../dtos/requests/create-ticket-dto';
import { UpdateTicketDto } from '../../dtos/requests/update-ticket-dto';
import { TicketPriority } from '../../models/ticket-priority';
import { AgentDto } from '../../dtos/responses/agent-dto';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent implements OnInit {
  tickets: (Ticket & { isEditing?: boolean; editDto?: UpdateTicketDto })[] = [];
  includeArchived: boolean = false;

  isAgent: boolean = false;
  currentUserId: number | null = null;
  agents: AgentDto[] = [];

  TicketPriority = TicketPriority;
  TicketStatus = TicketStatus;

  newTicket: CreateTicketDto = {
    title: '',
    description: '',
    priority: TicketPriority.LOW
  };

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUserInfo().subscribe({
      next: (userInfo: any) => {
        this.isAgent = userInfo.isAgent;
        this.currentUserId = userInfo.id ?? userInfo.userId ?? null;
        this.loadTickets();

        if (this.isAgent) {
          this.loadAgents();
        }
      },
      error: (err) => {
        console.error('Get connected user error.', err);
        this.loadTickets();
      }
    });
  }

  loadTickets(): void {
    this.ticketService.getTickets(this.includeArchived).subscribe({
      next: (data) => {
        this.tickets = data.map(ticket => ({
          ...ticket,
          isEditing: false,
          editDto: undefined
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Load tickets error.', err)
    });
  }

  loadAgents(): void {
    this.userService.getAgents().subscribe({
      next: (data) => {
        this.agents = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Load agents error.', err)
    });
  }

  takeCharge(ticket: Ticket): void {
    if (!ticket.id || !this.currentUserId) {
      alert("Connected user not identified.");
      return;
    }

    const updateDto: UpdateTicketDto = {
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      assignedAgentId: this.currentUserId
    };

    this.ticketService.updateTicket(ticket.id, updateDto).subscribe({
      next: (updated) => {
        ticket.assignedAgentId = updated.assignedAgentId;
        ticket.assignedAgentName = updated.assignedAgentName;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Take charge error.', err);
        alert(err.error?.message || 'Action not allowed.');
      }
    });
  }

  onSubmit(): void {
    this.ticketService.createTicket(this.newTicket).subscribe({
      next: () => {
        this.newTicket = {
          title: '',
          description: '',
          priority: TicketPriority.MEDIUM
        };
        this.loadTickets();
      },
      error: (err) => console.error('Create ticket error.', err)
    });
  }

  onArchive(ticket: Ticket): void {
    if (!ticket.id) return;
    this.ticketService.archiveTicket(ticket.id).subscribe({
      next: () => {
        this.loadTickets();
      },
      error: (err) => {
        console.error('Archive ticket error.', err);
        alert(err.error?.message || 'Action not allowed.');
      }
    });
  }

  startEdit(ticket: Ticket & { isEditing?: boolean; editDto?: UpdateTicketDto }): void {
    ticket.isEditing = true;
    ticket.editDto = {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority ?? TicketPriority.MEDIUM,
      status: ticket.status ?? TicketStatus.OPEN,
      assignedAgentId: ticket.assignedAgentId
    };
  }

  cancelEdit(ticket: Ticket & { isEditing?: boolean }): void {
    ticket.isEditing = false;
  }

  saveEdit(ticket: Ticket & { isEditing?: boolean; editDto?: UpdateTicketDto }): void {
    if (!ticket.id || !ticket.editDto) return;

    this.ticketService.updateTicket(ticket.id, ticket.editDto).subscribe({
      next: (updated) => {
        ticket.title = updated.title;
        ticket.description = updated.description;
        ticket.priority = updated.priority;
        ticket.status = updated.status;
        ticket.updatedAt = updated.updatedAt;
        ticket.assignedAgentId = updated.assignedAgentId;
        ticket.assignedAgentName = updated.assignedAgentName;
        ticket.isEditing = false;
      },
      error: (err) => {
        console.error('Update ticket error.', err);
        alert(err.error?.message || 'Action not allowed.');
      }
    });
  }
}