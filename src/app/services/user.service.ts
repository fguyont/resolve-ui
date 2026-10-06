import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgentDto } from '../dtos/responses/agent-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5076/api/users'; 

  constructor(private http: HttpClient) {}

  getAgents(): Observable<AgentDto[]> {
    return this.http.get<AgentDto[]>(`${this.apiUrl}/agents`);
  }
}