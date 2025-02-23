# Notes from Angular essentials section

## 01-starting project notes
### How angular renders things on the screen? 
- First file running is main.ts
- in index.html there are no scripts. It is applied when angular CLI builds the project
- then main.ts runs and changes all custom component tags into the code and markup provided in the component code
### Standalone component, what is that?
- now it is used as a default
- you do not need to create modules, it is done under the hood
- just import the component to a parent component
- <div 
  role="progressbar" 
  [attr.aria-valuenow]="currentVal" 
  [attr.aria-valuemax]="maxVal">...</div>
    By adding attr in front of the attribute name you want to bind dynamically, you're "telling" Angular that it shouldn't try to find a property with the specified name but instead bind the respective attribute - in the example above, the aria-valuenow and aria-valuemax attributes would be bound dynamically.
### Signals
- signal is a container that can store any type of value, and it will notify the Angular whenever it's changed
#### How to use it?
````ts
  export class UserTileComponent {
    @Input() user!: User;
    clickCounter = signal<number>(0); // setting initial value of the signal

    get imagePath() {
      return `assets/users/${this.user.avatar}`;
    }

    onClick() {
      //clickCounter ++;
      this.clickCounter.set(this.clickCounter() + 1);  // we can get signal value by adding parenthasis clickCounter() 
      // set() will update live and re-render 
    }
  }
````
- computed function is used with signals, to calculate a value live when signal changes
````ts
  export class UserTileComponent {
      selectedUser = signal(MOCK_USERS[random()]);
      // it is better becase it runs only when the selectedUser signal changes, not everytime component is changing(there could be more signals in computed)
      imagePath = computed(() => `assets/users/${this.selectedUser().avatar}`)
      // under the hood it also creates a signal so we use it like that: imagePath()
      
      // This won't work with signals
      // get imagePath() {
      //   return `assets/users/${this.user.avatar}`;
      // }

      onClick() {
        const randIndex = random();
        this.clickCounter.set(this.clickCounter() + 1);  // we can get signal value by adding parenthasis clickCounter() 
      }
  }
````
- handling input with signals
````ts
export class UserTileSignalComponent {
  // using input with signals. Instead of using decorator with capital 'I', we use small 'i'
  avatar = input.required<string>(); // like @Input({required: true})
  name = input.required<string>();
  imagePath = computed(() => `assets/users/${this.avatar()}`);

  changeSignal() {
    // input signal are readonly. They can only change from parent component
    // this.avatar.set('some value');
  }
}
````

### Evolution of ngIf and ngFor
- In Angular 17 there is no need to use ngIf and ngFor
- New syntax is @for(item of items track item.prop) and @if(condition)
  - in for we use track for better performance
  - The cool thing is using else is much more convinient now
  ````html
    <!-- new if -->
    @if (selectedUserDefined()) {
        <app-task-list [user]="selectedUser()!"></app-task-list>
    } @else {
        <h1>Select user to display his tasks</h1>
    }
    <!-- old way -->
    <app-task-list ngIf="selectedUser(); else elseBlock" [user]="selectedUser()!"></app-task-list>
    <ng-template #elseBlock>
      <h1>Select user to display his tasks</h1>
    </ng-template>
  ````

  - @let -> Allows to declare variables in a template
  ````html
    @let user = app.obj.user

    Address: {{user.address}}
    Name: {{user.name}}
  ````

  - @switch -> Instead of ngSwitch
  ````html
    @switch (userPermissions) {
      @case ('admin') {
        <app-admin-dashboard />
      }
      @default {
        <app-viewer-dashboard />
      }
    }
  ````

### Two way data binding
- It works like that, when we write into the input, the value is updated right away
- Live changes of the variable. To add it you have to wrap a directive with [()]
  * for example: [(ngModel)]
- By default no element supports two way binding
- ngModel is inside FormsModule
- input always yelds the 'string'. Even when different type ('date', 'number')
- Handling signals is easy. You just wrap the form element with signal and do not change anything in the template.html
````ts
newTaskSignal = signal<Task>({
    title: '',
    dueDate: '',
    summary: '',
    id: '',
    userId: ''
  }); // now inside the template we do not have to change anything. It will work with exactly the same syntax no '()'

````

### Forms handling
- When you are importing the FormsModule to the component. 
  You do not have to prevent the default behaviour it will happen automatically

### Content projection - (ng-content)
- if you want to add the content inside a custom component. You need to use the 
  * <ng-content></ng-content> directive
  ````html
    <header>
      <img class="logo"/>
      <ng-content><ng-content/>
    </header>

    <!-- other file -->
    <app-header>
      <div>
        <p>text</p>
      </div>
    <app-header/>

    <!-- result -->
    <header>
      <img class="logo"/>
      <div>
        <p>text</p>
      </div>
    </header>
  ````

### Pipes
- pipes allow you to transform the data to for example more readable standard
````html
<app-card>
    <h2>{{ task().title }}</h2>
    <time>{{ task().dueDate | date }}</time>
    <p>
        {{ task().summary }}
    </p>
    <p class="actions">
        <button (click)="completeTask()">Complete</button>
    </p>
</app-card>
````
- config can be passed after the ':'
````html
<app-card>
    <h2>{{ task().title }}</h2>
    <time>{{ task().dueDate | date:'fullDate' }}</time>
    <p>
        {{ task().summary }}
    </p>
    <p class="actions">
        <button (click)="completeTask()">Complete</button>
    </p>
</app-card>
````

## Modules

### Sandalone and modules together
````ts
@NgModule({
  imports: [SomeStandaloneComponent] // add a standalone components here
})
class Module {

}

````