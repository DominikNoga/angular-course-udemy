import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { controlsMatch } from '../utils/validators';

type UserRole = 'student' | 'teacher' | 'employee' | 'founder' | 'other';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [ReactiveFormsModule]
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    passwords: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      repeatPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)]
      })
    }, {
      validators: [controlsMatch('password', 'repeatPassword')]
    }),
    firstName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    lastName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    address: new FormGroup({
      street: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required)
    }),

    role: new FormControl<UserRole>('student', Validators.required),
    howFound: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false)
    ]),
    agree: new FormControl(false, Validators.requiredTrue)
  });

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form);
    } else {
      console.log('form invalid')
      console.log(this.form)
    }
  }

  onReset() {
    this.form.reset();
  }
}
