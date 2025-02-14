import { Injectable, signal } from '@angular/core';

import { Permission, PERMISSIONS } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  activePermission = signal<Permission>('guest');

  authenticate(email: string, password: string) {
    console.log(email, password);
    if (email === 'admin@a.com' && password === 'admin') {
      this.activePermission.set(PERMISSIONS.ADMIN);
    } else if (email === 'user@u.com' && password === 'user') {
      this.activePermission.set(PERMISSIONS.USER);
    } else {
      this.activePermission.set(PERMISSIONS.GUEST);
    }
  }

  logout() {
    this.activePermission.set(PERMISSIONS.GUEST);
  }
}
