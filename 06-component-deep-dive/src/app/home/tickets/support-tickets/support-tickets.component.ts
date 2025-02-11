import { Component } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { NewTicketComponent } from '../new-ticket/new-ticket.component';

@Component({
  selector: 'app-support-tickets',
  standalone: true,
  imports: [DashboardTileComponent, NewTicketComponent],
  templateUrl: './support-tickets.component.html',
  styleUrl: './support-tickets.component.css'
})
export class SupportTicketsComponent {

}
