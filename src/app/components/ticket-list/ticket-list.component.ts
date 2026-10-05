import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../models/ticket.model';
import { TicketStatus } from '../../models/ticket-status';
import { TicketService } from '../../services/ticket.service';
import { CreateTicketDto } from '../../dtos/requests/create-ticket-dto';
import { UpdateTicketDto } from '../../dtos/requests/update-ticket-dto';
import { TicketPriority } from '../../models/ticket-priority';

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

  newTicket: CreateTicketDto = {
    title: '',
    description: '',
    priority: TicketPriority.LOW
  };

  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadTickets();
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
      error: (err) => console.error('Erreur chargement tickets', err)
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
      error: (err) => console.error('Error creating ticket', err)
    });
  }

  onStatusChange(ticket: Ticket, newStatus: TicketStatus): void {
    if (!ticket.id) return;
    this.ticketService.updateTicketStatus(ticket.id, newStatus).subscribe({
      next: (updated) => {
        ticket.status = updated.status;
        ticket.updatedAt = updated.updatedAt;
        ticket.assignedAgentId = updated.assignedAgentId;
      },
      error: (err) => {
        console.error('Error updating status', err);
        alert(err.error?.message || 'Action non autorisée.');
      }
    });
  }

  onArchive(ticket: Ticket): void {
    if (!ticket.id) return;
    this.ticketService.archiveTicket(ticket.id).subscribe({
      next: () => {
        this.loadTickets();
      },
      error: (err) => console.error('Error archiving ticket', err)
    });
  }

  startEdit(ticket: Ticket & { isEditing?: boolean; editDto?: UpdateTicketDto }): void {
    ticket.isEditing = true;
    ticket.editDto = {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority ?? TicketPriority.MEDIUM
    };
  }

  cancelEdit(ticket: Ticket & { isEditing?: boolean }): void {
    ticket.isEditing = false;
  }

  saveEdit(ticket: Ticket & { isEditing?: boolean; editDto?: UpdateTicketDto }): void {
    if (!ticket.id || !ticket.editDto) return;
    this.ticketService.updateTicketContent(ticket.id, ticket.editDto).subscribe({
      next: (updated) => {
        ticket.title = updated.title;
        ticket.description = updated.description;
        ticket.priority = updated.priority;
        ticket.updatedAt = updated.updatedAt;
        ticket.isEditing = false;
      },
      error: (err) => console.error('Error updating ticket content', err)
    });
  }

  get isAgent(): boolean {
    return localStorage.getItem('user_role') === 'Agent';
  }
}