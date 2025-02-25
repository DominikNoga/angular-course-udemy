# Forms handling in Angular
There are 2 ways of handling forms in Angular

- Template-driven forms
    - set up forms inside component templates
    - can be tricky for more complex forms
- Reactive forms
    - setting up form inside the ts code
    - setting up is more complex, harder to understand
    - good for complex form

Deep dive:

## Template-driven forms
Like mentioned, we are managing this form via component template.
We need to register each form field with ngModel, we do not have to use 2w data binding.
In order for the code below to work we need to import FormsModule into the component.
It will automatically detect that the form is in the template and create the NgForm object.
Which later will be used for form handling.

````html
<!-- Here we are getting access to the ngForm obj in the template -->
<!-- We can either pass the form to the submit func, or get it via viewChild  -->
<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <!-- NgModel regu -->
      <input id="email" type="email" name="email" ngModel />
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" name="password" ngModel />
    </div>

    <button class="button">Login</button>
  </div>
</form>
````

### Validation
Validation happens, by combining attributes in html with the ts code.

<b>IMPORTANT</b>: Just adding the attributes, does not prevent from the form submission, we need to handle this in the .ts file

````html
<div class="control no-margin">
    <label for="email">Email</label>
    <input
        id="email"
        type="email"
        name="email"
        ngModel
        required
        email
    />
</div>
````

````ts
 onSubmit(loginForm: NgForm) {
    if (loginForm.invalid) {
    //   If data is invalid (for example email was incorrect or required fields was not filled, error will be shown)
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
````

#### Validation classes and properties
We can read some validation props to decide which message should we display.
In the example below. We show custom message for each form field.
If user has typed any value inside and if this value is not valid.

````html
<div class="errors">
     @if (email.touched && email.dirty && email.invalid) {
        <p class="control-error">
        Invalid email format.
        </p>
    }

    @if (password.touched && password.dirty && password.invalid) {
        <p class="control-error">
        Wrong password. Must be 6 characters or more
        </p>
    }
</div>
````

<b>CSS classes:</b> Angular also offers some css classes to show user the state of the form.
They are similar to the properties abov. With their help we can apply custom styles for a given state

- ng-invalid
- ng-touched
- ng-dirty
- ng-valid

### Updating form programatically
````ts
class Form {
  constructor() {
    const storedUserData = localStorage.getItem(this.USER_DATA_KEY);
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
      console.log(this.userData);
      // We need to set this timeout to wait for the next render cycle
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
}
````

## Reactive forms
Setting up the reactive form happens by initializing the FormGroup object.
Which is the same as the NgForm.form that we extracted when working with template driven forms.

- In order to work with reactive form we need to import the <b>ReactiveFormsModule</b> into our component.
- Improvement when using reactive forms is automatic proper type annotation for forms controls etc
- Just like with template driven forms we can add submit logic to the ngSubmit event.

````ts
@Component({
  // ...
  imports: [ReactiveFormsModule]
})
class ReactiveFormDemo {
  // the same as the NgForm.form object
  form = new FormGroup({
    email: new FormControl(''), // one argument is initial value
    password: new FormControl('')
  });

  onSubmit() {
    // this will have type annotation.
    this.form.value.email
  }
}
````

In order to let Angular know which form should we connect to this object.
We need to connect both form tag and form controlles.

````html
<!-- Connecting the form object -->
<form [formGroup]="form" (ngSubmit)="onSubmit()">
    <div class="control-row">
        <div class="control no-margin">
            <label for="email">Email</label>
            <!-- Conntecting email field -->
            <input id="email" type="email" formControlName="email" />
        </div>

        <div class="control no-margin">
            <label for="password">Password</label>
            <input id="password" type="password" formControlName="password" />
        </div>
    </div>
</form>
````

### Validators

#### Custom validators
- More here -> https://angular.dev/guide/forms/form-validation#adding-custom-validators-to-template-driven-forms