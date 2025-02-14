import { Component } from '@angular/core';
import { SafeLinkDirective } from '../shared/directives/safe-link/safe-link.directive';
import { LogDirective } from '../shared/directives/log/log.directive';

@Component({
  selector: 'app-learning-resources',
  templateUrl: './learning-resources.component.html',
  styleUrl: './learning-resources.component.css',
  imports: [SafeLinkDirective],
  standalone: true,
  hostDirectives: [LogDirective]
})
export class LearningResourcesComponent {}
