import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.model';
import { CreateTicketDto } from '../dtos/requests/create-ticket-dto';
import { UpdateTicketDto } from '../dtos/requests/update-ticket-dto';
import { TicketStatus } from '../models/ticket-status';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:5076/api/tickets';

  constructor(private http: HttpClient) {}

  getTickets(includeArchived: boolean = false): Observable<Ticket[]> {
    const params = new HttpParams().set('includeArchived', includeArchived.toString());
    return this.http.get<Ticket[]>(this.apiUrl, { params });
  }

  createTicket(dto: CreateTicketDto): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, dto);
  }

  updateTicketContent(id: number, dto: UpdateTicketDto): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, dto);
  }

  updateTicketStatus(id: number, status: TicketStatus): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}/status`, { status });
  }

  archiveTicket(id: number): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}/archive`, {});
  }
}