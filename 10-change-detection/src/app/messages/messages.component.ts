import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MessagesListComponent } from './messages-list/messages-list.component';
import { NewMessageComponent } from './new-message/new-message.component';
import { MessagesSignalListComponent } from './messages-list-signal/messages-list.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  imports: [MessagesListComponent, NewMessageComponent, MessagesSignalListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent {

  get debugOutput() {
    console.log('[Messages] "debugOutput" binding re-evaluated.');
    return 'Messages Component Debug Output';
  }
}
