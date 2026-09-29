import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'tickets',
        component: TicketListComponent,
        canActivate: [authGuard]
    },
    // Redirection par défaut vers le login au démarrage
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    // Route de secours en cas d'URL inconnue
    { path: '**', redirectTo: 'login' }
];