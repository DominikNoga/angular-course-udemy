import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

type UserData = {
  password?: string;
  email?: string;
}

@Component({
  selector: 'app-login-reactive',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-reactive.component.html',
  styleUrl: './login-reactive.component.css'
})
export class LoginReactiveComponent {
  // the same as the NgForm.form object
  form = new FormGroup({
    email: new FormControl(''), // one argument is initial value
    password: new FormControl('')
  }); 

  onSubmit(): void {
    console.log(this.form);
  }
}
