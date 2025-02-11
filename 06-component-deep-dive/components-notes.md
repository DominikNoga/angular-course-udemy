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

## Forms
### Template variables
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