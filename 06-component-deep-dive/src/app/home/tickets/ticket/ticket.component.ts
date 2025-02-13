import { Component, input, output, signal } from '@angular/core';
import { Ticket } from '../tickets.model';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  ticket = input.required<Ticket>();
  detailsVisible = signal<boolean>(false);
  onTicketComplete = output<string>();

  toggleDetails() {
    // this.detailsVisible.set(!this.detailsVisible());
    // Same as abvoe, but using the update method
    this.detailsVisible.update((visible) => !visible);
  }

  completeTicket() {
    this.onTicketComplete.emit(this.ticket().id);
  }
}
