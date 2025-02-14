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

### Custom structural directives
A structural directive changes the structure of the DOM. For example renders an element conditionally
In order to add this directive to the element we can follow 2 paths:
````html
  <!-- The '*' symbol automatically wraps the element with the ng-template -->
   <p *appAuth="PERMISSIONS.GUEST" class="protected-content unauthenticated">
    Guests should see this
  </p>

  <!-- WILL work the same as with the '*' symbol, it needs to be added with ng-template in order to work properly -->
  <ng-template [appAuth]="PERMISSIONS.ADMIN">
    <p>
      Only for admin
    </p>
  </ng-template>
````

In order to manipulate the DOM we need inject 2 things into our directive:
- TemplateRef -> Reference to the content of the <ng-template> which wraps the content, that we attach the directive to
- ViewContainerRef -> It marks the place in the DOM which will be affected by the directive

````ts
export class AuthDirective {
  userType = input.required<Permission>({
    alias: 'appAuth'
  });
  private authService = inject(AuthService);
  // it references the content of a ng-template element which wraps the content affected by our directive
  private templateRef = inject<TemplateRef<HTMLElement>>(TemplateRef);
  // it references the place in the DOM where the directive is applied
  private viewContainerRef = inject<ViewContainerRef>(ViewContainerRef);

  constructor() {
    effect(() => {
      if (this.authService.activePermission() === this.userType()) {
        // We are creating the view for our template
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        // Clear the view, and remove it from the DOM
        this.viewContainerRef.clear();
      }
    });
  }
}
````

### Adding directive to the hostElement
We can add directive to the whole component/directive, by using the hostDirectives property of the @Component or even @Directive decorators

Directive definition: It will log the host, each time it is clicked
````ts
@Directive({
  selector: '[appLog]',
  standalone: true,
  host: {
    '(click)': 'onLog()'
  }
})
export class LogDirective {
  private hostElementRef = inject<ElementRef>(ElementRef);

  onLog = () => {
    console.log('Element clicked:', this.hostElementRef.nativeElement);
  };
}
````

Now we can add this directive the whole component without unnecesseary repetitions
````ts
@Component({
  selector: 'app-learning-resources',
  templateUrl: './learning-resources.component.html',
  styleUrl: './learning-resources.component.css',
  imports: [SafeLinkDirective],
  standalone: true,
  hostDirectives: [LogDirective] // All elements in our template will have this assigned
})
export class LearningResourcesComponent {}
````