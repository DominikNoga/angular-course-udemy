# Directives
Directive is an enchancement for template elements.
It applies some extra behavoiur to the element. For example ngModel to pass the data from an input to the variable.
We can create a custom directives or use a built-in one.
Directives does <b>NOT</b> have their own templates. This is what differs them from components

* Attribute directive: we are assigning it as an attribute, and we do not change the structure of the template. 
ngModel is an example

* Structural directive: it changes the html structure. 
For example *ngIf or *ngFor. We are rather not using those built-in ones

## Custom directive
Can be generated with "ng g d directive_name" command
### Declaring a directive
````ts
@Directive({
  selector: '[appSafeLink]', // attributeDirective
  selector: 'a[appSafeLink]', // attributeDirective just for anchor tags
  standalone: true
})
export class MyCustomDirevtive {

  constructor() { 

  }

}

````

### Events handling
````ts
@Directive({
  selector: 'a[appSafeLink]',
  standalone: true,
  host: {
    '(click)': 'onConfirmLeavePage($event)' // when a host is clicked do this
  }
})
export class SafeLinkDirective {
  // Accesing the host element using the inject(ElementRef) syntax
  // This allows to take control of the native html element
  // we can use it instead of event.target
  private hostElementRef = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

  constructor() {
    console.log('SafeLinkDirective instantiated');
  }

  onConfirmLeavePage(event: MouseEvent) { // mouse event is a built in event for anchor element click
    const wantsToLeave = window.confirm('Are you sure you want to leave this page?');

    if (wantsToLeave) {
      const address = this.hostElementRef.nativeElement.href;
      this.hostElementRef.nativeElement.href = `${address}?from=${this.source()}`;
      return;
    }
    console.log('Stay on the page');
    event.preventDefault();
  }
}

````