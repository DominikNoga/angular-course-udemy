import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';

type UserData = {
  password?: string;
  email?: string;
}

const mustContainQuestionMark = (control: AbstractControl) => {
  if (control.value.includes('?'))
    return null;

  return {
    noQuestionMark: true
  }
};

// Async validator which returns an observable
const emailIsUnique = (control: AbstractControl) => {
  if (control.value !== 'dominik.noga2001@gmail.com') {
    // it is a rxjs function which creates an observable that is instantly returning a value
    return of(null);
  };
  return of({
    notUnique: true
  });
}

@Component({
  selector: 'app-login-reactive',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-reactive.component.html',
  styleUrl: './login-reactive.component.css'
})
export class LoginReactiveComponent implements OnInit {
  // the same as the NgForm.form object
  form = new FormGroup({
    email: new FormControl('', {
      validators: [
        Validators.email,
        Validators.required
      ],
      asyncValidators: [
        emailIsUnique
      ]
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark
      ]
    })
  });
  private readonly USER_DATA_KEY = 'user.data';
  userData: UserData | undefined = undefined
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const storedUserData = localStorage.getItem(this.USER_DATA_KEY);
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
      console.log(this.userData);
      // Allows to partially update form
      // set value needs all required inputs
      this.form.patchValue({
        email: this.userData!.email!
      });
    }

    const sub = this.form.valueChanges.pipe(
      debounceTime(500)
    ).subscribe({
      next: (formData) => {
        localStorage.setItem(this.USER_DATA_KEY, JSON.stringify({
          email: formData.email
        }))
      }
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  private isControlInvalid(control: FormControl) {
    return control.touched &&
      control.dirty &&
      control.invalid
  }

  get isEmailInvalid() {
    return this.isControlInvalid(this.form.controls.email);
  }

  get isPasswordInvalid() {
    return this.isControlInvalid(this.form.controls.password);
  }

  onSubmit(): void {
    console.log(this.form);
  }
}
