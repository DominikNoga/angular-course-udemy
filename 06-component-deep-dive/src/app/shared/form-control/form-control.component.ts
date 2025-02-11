import { Component, ElementRef, HostBinding, HostListener, inject, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-form-control',
  standalone: true,
  imports: [],
  templateUrl: './form-control.component.html',
  styleUrl: './form-control.component.css',
  encapsulation: ViewEncapsulation.None, // it removes style encapsulation, which means that the style for the component won't be scoped only for this component
  host: {
    class: 'control', // Anything added to the host object will be added as the attribute to the host element of our component content
    '(click)': 'onHostClick()'
  }                  // It allows us, to remove unnecesseary wrappers around our components
})
export class FormControlComponent {
  // @HostBinding('class') className = 'control' // same result as host property added in component decorator NOT prefered now
  
  // @HostListener('click') onHostClick2() {
  //   console.log('Host clicked! Using @HostListener'); // Again it is the same result as above, but it is NOT recomended
  // }

  label = input.required<string>();
  // Programatic access to the host element, it is rather not needed
  private hostElement = inject(ElementRef); // we are getting access to the host element of our component

  onHostClick() {
    console.log('Host clicked');
    console.log(this.hostElement);
  }
}
