import { Component, input } from '@angular/core';

@Component({
  selector: 'button[appButton]', // There are more ways to create components like in angularJs Directive can be 'class' or 'attribute'
  // Here w also are able to do that
  // selector: button[appButton] will change the structure of the component for each button with attribute appButton
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
}
