# Forms handling in Angular
In depth guide: https://angular.dev/guide/forms

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

### Nested form groups
For a better structure we might want to divide the main form group into more groups.
It is better because:
- the final 'value' object structure reflects the data more correctly
- we can apply validation functions for the whole group

````ts
class SignupForm {
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
    })
  });
}
````

````html
<!-- now in the template we can simply refer to the form group, and the sub form group -->
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <div class="control">
    <label for="email">Email</label>
    <input id="email" type="email" name="email" formControlName="email" />
  </div>

  <!-- We are passing sub-from group name -->
  <div class="control-row" formGroupName="passwords">
    <div class="control">
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        formControlName="password"
      />
    </div>

    <div class="control">
      <label for="confirm-password">Confirm Password</label>
      <input
        id="confirm-password"
        type="password"
        name="confirm-password"
        formControlName="repeatPassword"
      />
    </div>
  </div>
</form>
````

### Validators
Validator is simply a function which checks for some properties on the formControl object.
There are a plenty of built-in validators. They are part of the Validators object,
which is imported from @angular/forms.

````ts
export class LoginReactiveComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [
        // We are passing validator functions in the array
        Validators.email,
        Validators.required
      ]
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6)
      ]
    })
  });
}
````
#### Custom validators
- custom validator for td forms -> https://angular.dev/guide/forms/form-validation#adding-custom-validators-to-template-driven-forms

For reactive forms we can easily create validators as a normal js functions.
As the argument they are taking the formControl. And they need to return either 'null' which means no error.
Or Object with some kind of info what error it is:
````ts
const validator = (ctrl: AbstractControl) => {
  if (ctrl.invalid) {
    return {
      someError: true
    };
  }

  return null;
}
````
There are several types of validators:
- One specific field validator -> We are checking this given control
````ts
const notNullValidator = (ctrl: AbstractControl) => {
  if (_.isNil(ctrl)) {
    return {
      isNull: true
    };
  }
  return null;
}
````
- Factory function validator -> It allows to take the argument like the built-in min-length validator.
This kind of validator needs to return the validator function, explained above.
````ts
const customMinLength = (minLength: number): ValidatorFn => 
  (ctrl: AbstractControl) => {
    if (ctrl.value.length < minLength) {
      return {
        toShort: true
      };
    }
    return null;
}
````
- FormGroup validator -> This is a benefit for dividing the form into smaller groups.
We can for example validate the password group for the password match.

````ts
// Here we connect factory validator with the group validator
const controlsMatch = (controlName1: string, controlName2: string): ValidatorFn => 
    (control: AbstractControl) => {
      // The control passed here refers to the whole 'passwords' group
        // Ts does not know to which group it is applied so we need to get those controls by names
        const password = control.get(controlName1)?.value;
        const repeatPassword = control.get(controlName2)?.value;
        if (password && repeatPassword && password !== repeatPassword) {
            return { passwordsDoesNotMatch: true };
        }
        return null;
    };
class From {
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
      // Passing validator to the whole group
      validators: [controlsMatch('password', 'repeatPassword')]
    })
  });
}
````

#### Async validators
We can pass or create asnyc validator which can make the calls to the api in order for validating the data.
For example for email input we can ask db is this email currently in the database? Or any other prop like 'username' 
We are passing those validators like the sync one, to the separate array.
````ts
// Here we are making a more generic validator for both email and username
const propertyExists = (propName: 'email' | 'username'): AsyncValidatorFn => 
    (control: AbstractControl) => {
        return this.httpClient.get<{exists: boolean}>(`api/${propName}/exists?${propName}=${control.value}`).pipe(
          // Wait until user stops typing
          debounceTime(500),
          // Map the api response to the 
          map((response: {exists: boolean}) => response.exists ? {emailTaken: true} : null ),
          catchError(() => of(null))
        );
    }

export class LoginReactiveComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [
        Validators.email,
        Validators.required
      ],
      asyncValidators: [
        propertyExists('email')
      ]
    })
  });
}
````

### Form array
We can define few values without giving them some custom names and moving them to separate group,
nice for set of checkboxes.

````ts
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    })
    howFound: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false)
    ])
  });
}
````

````html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <div class="control">
    <label for="email">Email</label>
    <input id="email" type="email" name="email" formControlName="email" />
  </div>

   <!-- Here we pass an array --> 
  <fieldset formArrayName="howFound">
    <legend>How did you find us?</legend>
    <div class="control">
      <!-- Form ctrl name is an index of the input -->
      <input
        type="checkbox"
        id="google"
        name="acquisition"
        value="google"

        formControlName="0"
      />
      <label for="google">Google</label>
    </div>

    <div class="control">
      <input
        type="checkbox"
        id="friend"
        name="acquisition"
        value="friend"
        formControlName="1"
      />
      <label for="friend">Referred by friend</label>
    </div>

    <div class="control">
      <input
        type="checkbox"
        id="other"
        name="acquisition"
        value="other"
        formControlName="2"
      />
      <label for="other">Other</label>
    </div>
  </fieldset>
</form>
````