import { Component } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { NewTicketComponent } from '../new-ticket/new-ticket.component';
import { Ticket } from '../tickets.model';
import { TicketComponent } from "../ticket/ticket.component";

@Component({
  selector: 'app-support-tickets',
  standalone: true,
  imports: [DashboardTileComponent, NewTicketComponent, TicketComponent],
  templateUrl: './support-tickets.component.html',
  styleUrl: './support-tickets.component.css'
})
export class SupportTicketsComponent {
  tickets: Ticket[] = [];

  onTicketAdd(newTicket: Ticket) {
    this.tickets.push(newTicket);
    console.log(this.tickets)
  }
}
