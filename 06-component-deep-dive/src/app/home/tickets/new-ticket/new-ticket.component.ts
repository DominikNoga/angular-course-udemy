import { Component, ElementRef, AfterViewInit, viewChild, ViewChild, ViewChildren, OnInit, Output, EventEmitter, output } from '@angular/core';
import { ButtonComponent } from "../../../shared/button/button.component";
import { FormControlComponent } from "../../../shared/form-control/form-control.component";
import { FormsModule } from '@angular/forms';
import { NewTicketDto, Ticket, TICKET_STATUS } from '../tickets.model';


@Component({
  selector: 'app-new-ticket',
  standalone: true,
  imports: [ButtonComponent, FormControlComponent, FormsModule],
  templateUrl: './new-ticket.component.html',
  styleUrl: './new-ticket.component.css'
})
export class NewTicketComponent implements AfterViewInit, OnInit {
  @ViewChild('form') private form?: ElementRef<HTMLFormElement>;
  @ViewChildren(ButtonComponent) buttons?: ElementRef<ButtonComponent>[];
  private form2 = viewChild.required<ElementRef<HTMLFormElement>>('form'); // Available since Angular 17.3
  onTicketAdd = output<Ticket>();
  newTicketData: NewTicketDto = {
    title: '',
    request: ''
  };

  ngOnInit(): void {
    // This will be undefined
    console.log('On Init')
    console.log(this.buttons);
    console.log(this.form)
    console.log('signal variable');
    console.log(this.form2().nativeElement);
  }
  
  ngAfterViewInit(): void {
    // This will be defined, because the view (which is a template) is initialzied
    console.log('After view Init')
    console.log(this.buttons);
    console.log(this.form);
  }

  onSubmitWithNgModel() {
    const id = (Math.floor(Math.random() * 10000000)).toString();
    const newTicket: Ticket = {
      id: id,
      status: Number(id) % 2 ? TICKET_STATUS.OPEN : TICKET_STATUS.CLOSED,
      ...this.newTicketData
    };

    this.onTicketAdd.emit(newTicket);
    console.log(newTicket);
    // this.form?.nativeElement.reset();
    // this is exactly the same as the above, but using signals
    this.form2().nativeElement.reset();
  }

  onSubmit(titleElement: HTMLInputElement, requestElement: HTMLTextAreaElement) {
    const id = (Math.floor(Math.random() * 10000000)).toString();
    const newTicket: Ticket = {
      id: id,
      title: titleElement.value,
      request: requestElement.value,
      status: Number(id) % 2 ? TICKET_STATUS.OPEN : TICKET_STATUS.CLOSED
    };

    this.onTicketAdd.emit(newTicket);
    console.log(newTicket);
    // this.form?.nativeElement.reset();
    // this is exactly the same as the above, but using signals
    this.form2().nativeElement.reset();
  }
}
