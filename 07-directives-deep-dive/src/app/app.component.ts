import { Component, computed, inject } from '@angular/core';

import { AuthComponent } from './auth/auth.component';
import { LearningResourcesComponent } from './learning-resources/learning-resources.component';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
import { AuthDirective } from './shared/directives/auth/auth.directive';
import { PERMISSIONS } from './auth/auth.model';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [AuthComponent, LearningResourcesComponent, CommonModule, AuthDirective],
})
export class AppComponent {
  private authService = inject(AuthService);
  readonly PERMISSIONS = PERMISSIONS;

  isAdmin = computed(() => this.authService.activePermission() === 'admin');
}
