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
