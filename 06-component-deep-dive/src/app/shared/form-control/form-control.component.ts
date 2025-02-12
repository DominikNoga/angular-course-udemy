import { AfterContentInit, afterNextRender, afterRender, Component, contentChild, ContentChild, ElementRef, HostBinding, HostListener, inject, input, ViewEncapsulation } from '@angular/core';

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
export class FormControlComponent implements AfterContentInit {
  // @HostBinding('class') className = 'control' // same result as host property added in component decorator NOT prefered now
  
  // @HostListener('click') onHostClick2() {
  //   console.log('Host clicked! Using @HostListener'); // Again it is the same result as above, but it is NOT recomended
  // }

  @ContentChild('input') private control?: ElementRef<HTMLTextAreaElement | HTMLInputElement>
  private control2 = contentChild.required<ElementRef<HTMLTextAreaElement | HTMLInputElement>>('input');

  label = input.required<string>();
  // Programatic access to the host element, it is rather not needed
  private hostElement = inject(ElementRef); // we are getting access to the host element of our component

  constructor() {
    // afterRender(() => {
    //   // It happens after any changes in the whole Angular application
    //   // Any re-render in any component will cause this function running
    //   // Useful for continous updates after each render
    //   console.log('after render')
    // });

    // afterNextRender(() => {
    //   // This also runs for the whole application, but it will run only for the first component render
    //   // useful for third party UI elements initialization
    //   // JUST once per component instance
    //   console.log('after next render');
    // })
  }

  ngOnInit(): void {
    // This will be undefined
    console.log(this.control);
  }

  ngAfterContentInit(): void {
    // this will be defined for sure
    console.log(this.control);
  }

  onHostClick() {
    // console.log('Host clicked');
    // console.log(this.hostElement);
  }
}
