import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    messages$ = new BehaviorSubject<string[]>([]);
    private messages: string[] = [];

    getMessages(): string[] {
        return [...this.messages];
    }

    addMessage(message: string) {
        // this.messages.update((prevMessages) => [...prevMessages, message]);
        this.messages = [...this.messages, message];
        this.messages$.next([...this.messages]);
    }
}