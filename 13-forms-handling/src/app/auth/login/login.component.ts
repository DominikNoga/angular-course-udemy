import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

type UserData = {
  password: string;
  email: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule]
})
export class LoginComponent {
  userData: UserData | undefined = undefined
  onSubmit(loginForm: NgForm) {
    if (loginForm.invalid) {
      alert('Form is invalid');
      return;
    }
    const {email, password} = loginForm.form.value;
    this.userData = {
      email,
      password
    };
    console.log(this.userData);
  }
}
