import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { MessageSignalService } from '../messages-signal.service';

@Component({
  selector: 'app-messages-signal-list',
  standalone: true,
  imports: [],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesSignalListComponent {
  private messageService = inject(MessageSignalService);
  messages: Signal<string[]> = this.messageService.allMessages;

  get debugOutput() {
    console.log('[MessagesList] "debugOutput" binding re-evaluated.');
    return 'MessagesList Component Debug Output';
  }
}
