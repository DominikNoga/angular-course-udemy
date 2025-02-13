import { Component } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { NewTicketComponent } from '../new-ticket/new-ticket.component';
import { Ticket, TICKET_STATUS } from '../tickets.model';
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

  onTicketComplete(ticketId: string) {
    this.tickets = this.tickets.map(ticket => {
      if (ticket.id === ticketId) {
        ticket.status = TICKET_STATUS.CLOSED;
      }
      return ticket;
    });
  }
}
