import { afterNextRender, Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

type UserData = {
  password?: string;
  email?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule]
})
export class LoginComponent {
  isError = signal<boolean>(false);
  userData: UserData | undefined = undefined
  private loginForm = viewChild.required<NgForm>('loginForm');
  private readonly USER_DATA_KEY = 'user.data';
  private destroyRef = inject(DestroyRef);
  
  constructor() {
    const storedUserData = localStorage.getItem(this.USER_DATA_KEY);
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
      console.log(this.userData);
      // We need to 
      setTimeout(() => {
        this.loginForm().setValue({
          email: this.userData?.email,
          password: ''
        });
      }, 1);
    }
    afterNextRender(() => {
      const sub = this.loginForm().valueChanges?.pipe(
        debounceTime(500) // next function will run only after the user will stop typing for at least 500 ms, better for perf
      ).subscribe({
        next: (formData: UserData) => {
          localStorage.setItem(this.USER_DATA_KEY, JSON.stringify({
            email: formData.email
          }))
        }
      });
      this.destroyRef.onDestroy(() => sub?.unsubscribe());
    });
  }

  onSubmit(loginForm: NgForm) {
    console.log(loginForm);
    const form = loginForm.form;
    if (loginForm.invalid) {
      return;
    }
    const {email, password} = loginForm.form.value;
    this.userData = {
      email,
      password
    };
    this.isError.set(false);
    console.log(this.userData);
    // clear input values (sets as pristine etc) and reset the form
    form.reset();
  }
}
