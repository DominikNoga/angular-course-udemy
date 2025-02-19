# Change detection
Everything in Angular is wrapped inside the "Zone". Thanks to that it can be notified about some change.
After any action (button click, etc.), Angular scans all components, and all bindings to check if this action affects those components.
So if anything happens in the "template bindings" no matter what changes in the app, Angular will visit this place and update it.

<b>During development</b>: All places are visited twice in order to detect if there are any unwanted changes in the second cycle.
If something will change it will result with "ExpressionChangedAfterCheckedError"

<b>How to optimize code?</b><br />

- Don't perform costly operations in template bindings, it will run often.

````ts
// WRONG 

class Component {
    get something() {
        for (i=0; i < 1_000_000_000; i++) {
            ...
        }
        return something + 'test';
    }
}

````
````html
<h1>TEST</h1>
{{ something }}
````

- Inform Angular is something not worthy to look evaluate (Zone pollution)

````ts
class Component {
    private zone = inject(NgZone);
    variable

    constructor() {
        setTimeout(() => {
            console.log('Important calculation')
            variable *= 10;
        });

        // This code won't be used during change detection
        zone.runOutsideAngular(() => {
            setTimeout(() => {
                console.log('not important to watch')
            })
        })
    }
}
````

- OnPush strategy
    - Default strategy checks each component with any change in app
    - This will only detect change when something changes in this component or child component
    - It will run when event happens in the app-messages or input value changes here
    - We should use it for bigger apps and when all components are not connected
    - Works also with signals and with signal change
    - <b>Summary:</b> change detection will run for this component if:
        - it's input value changes
        - event happened
        - it was manually trigerred
        - signal has changed

````ts
@Component({
  selector: 'app-messages',
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  imports: [MessagesListComponent, NewMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush // We set this here
})
export class MessagesComponent {

}
````

- markForCheck() 
    - runs a check manually for this component
    - here we are running it when messages are updated
    - needed for onPush strategy without signals
````ts
export class MessagesListComponent implements OnInit{
  private cdRef = inject(ChangeDetectorRef);
  private messageService = inject(MessagesService);
  private destroyRef = inject(DestroyRef);
  messages: string[] = [];

  ngOnInit(): void {
    this.messageService.messages$.subscribe((messages: string[]) => {
      this.messages = messages;
      // It will run change detection for this component and its children 
      this.cdRef.markForCheck();
    });
     this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }
}

````
