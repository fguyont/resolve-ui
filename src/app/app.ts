import { Component } from '@angular/core';
import { TicketListComponent } from './components/ticket-list/ticket-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TicketListComponent],
  template: `<app-ticket-list></app-ticket-list>`
})
export class App {
  title = 'ResolveUi';
}