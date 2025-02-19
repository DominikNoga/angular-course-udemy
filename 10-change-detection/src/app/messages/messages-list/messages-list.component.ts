import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesListComponent implements OnInit{
  private cdRef = inject(ChangeDetectorRef);
  private messageService = inject(MessagesService);
  private destroyRef = inject(DestroyRef);
  // messages: Signal<string[]> = this.messageService.getMessages();
  messages: string[] = [];

  ngOnInit(): void {
    const sub = this.messageService.messages$.subscribe((messages: string[]) => {
      this.messages = messages;
      // It will run change detection for this component and its children 
      this.cdRef.markForCheck();
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  get debugOutput() {
    console.log('[MessagesList] "debugOutput" binding re-evaluated.');
    return 'MessagesList Component Debug Output';
  }
}
