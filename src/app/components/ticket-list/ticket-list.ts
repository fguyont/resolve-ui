import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css'
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  newTicket: Ticket = { title: '', description: '', priority: 'LOW' };
  private cdr = inject(ChangeDetectorRef);

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe({
      next: (data) => this.tickets = data,
      error: (err) => console.error('Error fetching tickets', err)
    });
  }

  onSubmit(): void {
    this.ticketService.createTicket(this.newTicket).subscribe({
      next: (created) => {
        this.tickets.unshift(created);
        this.newTicket = { title: '', description: '', priority: 'LOW' };
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error creating ticket', err)
    });
  }
}