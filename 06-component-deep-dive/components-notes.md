# Section 06 - components deep dive

## How to split up application to components, rules
- 1 component should do one thing
- components should be as lean as possible. No too much logic inside

## Selector in the component
import { Component } from '@angular/core';

````ts
@Component({
  selector: 'app-button', // There are more ways to create components like in angularJs Directive can be 'class' or 'attribute'
  // Here w also are able to do that
  // selector: button[appButton] will change the structure of the component for each button with attribute appButton
  // it is good practise to prefix an attribute with the same prefix as an app prefix
  // DOCS: https://angular.dev/guide/components/selectors
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
}

````
## Multiple ng-content in a template
We can use multiple ng content if we will assign a select property to one of the ng-contents. 
````html
  <span>
      <ng-content></ng-content>
  </span>
  <ng-content select=".icon">
    -> <!-- Here we can provide a fallback  content for ng-content if nothing is passed -->
  </ng-content>

  <!-- Using in a template -->
   <button appButton>
      Submit
      <span class="icon">⌲</span> // This will go to second ng-content
    </button>
  <!-- Second way is to use an ngProjectAs attribute  -->

   <span>
      <ng-content></ng-content>
  </span>
  <span class="icon">
    <ng-content select="icon"></ng-content>
  </span>

  <!-- Using in a template -->
  <button appButton>
    Submit
    <span ngProjectAs="icon">⌲</span> // This will go to second ng-content
  </button>

  <!-- We can also use this feature to restrict what can go into ng-content -->
   <p>
    <label>{{ label() }}</label>
    <!-- here only input or a textarea will go here -->
    <ng-content select="input, textarea"></ng-content>
</p>
````
## Template variables
````html
<form (ngSubmit)="onSubmit(titleInput, requestInput)">
    <app-form-control label="Title">
      <!-- #titleInput creates a variable of type HTMLInputElement, and we can pass it to onSubmit and extract the value -->
      <!-- If we do not need to update the value live it is good solution  -->
        <input name="title" id="title" #titleInput />
    </app-form-control>
    <app-form-control label="Request">
        <textarea name="request" id="request" rows="3" #requestInput></textarea>
    </app-form-control>
    <p>
        <button appButton>
            Submit
            <span class="icon">⌲</span>
        </button>
    </p>
</form>
````

## ViewChild/ViewChildren
Allows accessing the html element. We can either access it by adding the component selector, or a directive.
Or by passing the template variable name.
We can also use a signal version

````ts
class ViewChildDemo {
  // it will access the form variable 
 @ViewChild('form') form?: ElementRef<HTMLFormElement>;
 // this will acess all buttons in the template
 @ViewChildren(ButtonComponent) buttons?: ElementRef<ButtonComponent>[];
 private form2 = viewChild<ElementRef<HTMLFormElement>>('form'); // here we are not sure there will be a form element in the template
 private form3 = viewChild.required<ElementRef<HTMLFormElement>>('form'); // here we are sure, and we can skip the question mark

 onSubmit(titleElement: HTMLInputElement, requestElement: HTMLTextAreaElement) {
    doSth();
    this.form?.nativeElement.reset(); // nativeElement is our form
    this.form2()?.nativeElement.reset();
    this.form3().nativeElement.reset();
  }
}
````

## ContentChild/ContentChildren
Very similar to ViewChild, but it works for the projected content.
Which is content added through ng-content.

````html
<!-- HTML of the form control with projected content -->
<label>{{ label() }}</label>
<ng-content select="input, textarea"></ng-content>
````

````ts
class FormControlComponent {
  // Now we need to add #input template variable in order to get access to that
  @ContentChild('input') private control?: ElementRef<HTMLTextAreaElement | HTMLInputElement>
  // we can do the same with signals
  private control2 = contentChild.required<ElementRef<HTMLTextAreaElement | HTMLInputElement>>('input');
}
````

````html
<!-- HTML of the component which is using form control component -->
<form (ngSubmit)="onSubmit(titleInput, requestInput)" #form>
    <app-form-control label="Title">
        <input name="title" id="title" #titleInput #input />
    </app-form-control>
    <app-form-control label="Request">
        <textarea name="request" id="request" rows="3" #requestInput #input></textarea>
    </app-form-control>
</form>
````

## Effect function
It is a function which allows to setup a subscription for a signal and perform some action on each signal change

````ts
class SignalEffect {
  currentStatus = signal<ServerStatus>(SERVER_STATUS.ONLINE);

  constructor() {
    effect((onCleanup) => {
      console.log(`status has changed to: ${this.currentStatus()}`);
      // Cleanup is automatic but we can do some custom cleanup
      onCleanup(() => {
        // Do some cleanup
      })
    })
  }
}
````
