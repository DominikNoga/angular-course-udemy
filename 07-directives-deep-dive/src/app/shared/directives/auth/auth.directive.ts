import { Directive, effect, ElementRef, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Permission } from '../../../auth/auth.model';
import { AuthService } from '../../../auth/auth.service';

@Directive({
  selector: '[appAuth]',
  standalone: true
})
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
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    });
  }
}
