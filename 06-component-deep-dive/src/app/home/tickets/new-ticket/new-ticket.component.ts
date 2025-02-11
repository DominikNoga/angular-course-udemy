import { Component } from '@angular/core';
import { ButtonComponent } from "../../../shared/button/button.component";
import { FormControlComponent } from "../../../shared/form-control/form-control.component";
import { FormsModule } from '@angular/forms';

type Ticket = {
  title: string;
  request: string;
};

@Component({
  selector: 'app-new-ticket',
  standalone: true,
  imports: [ButtonComponent, FormControlComponent, FormsModule],
  templateUrl: './new-ticket.component.html',
  styleUrl: './new-ticket.component.css'
})
export class NewTicketComponent {
  onSubmit(titleElement: HTMLInputElement, requestElement: HTMLTextAreaElement, form: HTMLFormElement) {
    const newTicket: Ticket = {
      title: titleElement.value,
      request: requestElement.value
    };

    console.log(newTicket);
    form.reset();
  }
}
