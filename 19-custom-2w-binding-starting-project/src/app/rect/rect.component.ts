import { Component, input, model, output } from '@angular/core';
import { Rect } from './rect.model';

@Component({
  selector: 'app-rect',
  standalone: true,
  imports: [],
  templateUrl: './rect.component.html',
  styleUrl: './rect.component.css',
})
export class RectComponent {
  // size = input.required<Rect>();
  // sizeChange = output<Rect>();

  size = model.required<Rect>(); // easier than the version above

  onReset() {
    this.size.set({ width: '100', height: '100' });
  }
}
