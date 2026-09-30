import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  newTicket: Ticket = { title: '', description: '', priority: 'LOW' };
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTickets();
    }
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe({
      next: (data) => {
        console.log('✅ Données reçues dans le composant :', data);
        this.tickets = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading tickets', err)
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