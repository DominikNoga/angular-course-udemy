# Services
It is a class which is used to provide a buisness logic for components.
It is declared using special @Service decorator. Which takes some configuration

````ts
import { Injectable } from '@angular/core';

@Injectable({
    // The most typical, it declares a service which is available in every component
    // If changed the scope will change
    providedIn: 'root' 
  
})
export class TasksService {
  constructor() { }
}

````

## Dependency Injection
In order to provide a service inside our component/service we need to inject this.
Thanks to built in DI mechanism in Angular. We can provide a shared service which will hold the same state in every component.
There are two best ways for injecting a service

````ts
@Component({
  selector: 'app-tasks-list',
  standalone: true,
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
  imports: [TaskItemComponent],
})
export class TasksListComponent {
  selectedFilter = signal<string>('all');
  // Injection via inject function by providing an injection token which is a class name   
  private otherService = inject(OtherService)
  // Injection via controller   
  constructor(private tasksService: TasksService) { }
}
````

## Injectors
More about injectors here: https://angular.dev/guide/di/hierarchical-dependency-injection
- Null injector -> if we request service without provider, this is responsible for returning an error
- Platform environment injector -> Allows to provide a services for whole project (could be several apps)
  - bootstraping more applications
  - providing it like this prevents Angular from tree shaking, which is removing the not needed code parts from the initial bundles to improve performance.
  - providing for root is better
````ts
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }, TestService
  ]
}).catch((err) => console.error(err));
````
- Root environment injector -> Provides a service for whole application
- Module injector -> When using ng modules, you can provide service only for one module
- Element injector -> We are providing a service just for the Component or a Directive, and for the child components (depending on the config)
  - With this injector when injecting it into several components, we will work on the different instances (the state won't be shared)
````ts
import ItemService from 'item.service.ts'
@Component({
  …
  providers: [ItemService]
})
export class TestComponent
````

## Injection mechanism
Example how the service providing works, and how can we customize this.

````ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

export const CustomTaskServiceToken = new InjectionToken<TasksService>('description-for-debug') // now when we will want to inject the service we will use this token

bootstrapApplication(AppComponent, {
  providers: [
    TestService
  ]
}).catch((err) => console.error(err));

// IS EQUAL TO
bootstrapApplication(AppComponent, {
  providers: [
    {
      // Creates a token, which indentifies the service that we wanna inject.
      // By default the name of the service -> If we will use a shortcut
      provide: CustomTaskServiceToken, 
      useClass: TasksService // TasksService is a class
    }
  ]
}).catch((err) => console.error(err));
````

````ts
// INJECTION DEMO
@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
})
export class TaskItemComponent {
  readonly TASK_STATUS_OPTIONS = TASK_STATUS_INPUT;
  // using inject function
  private tasksService = inject(CustomTasksServiceToken);

  // using constructor
  constructor(@Inject(CustomToken) private customService: CustomService) {}
}
````

## Providing non-services
Using the custom injection token we can provide a different things.
For example constants.

````ts
// CREATING THE PROVIDER
export const TaskFilterOptions = [

  ...TASK_STATUS_INPUT,
  {
    value: 'all',
    label: 'All',
    status: 'all'
  }
 ] as const;

export const TASK_FILTER_OPTIONS = new InjectionToken<typeof TaskFilterOptions>('task-filter-options');

export const TaskFilterOptionsProvider: ValueProvider = {
  provide: TASK_FILTER_OPTIONS,
  useValue: TaskFilterOptions
}
````

````ts
// ACCESSING THE VALUE
@Component({
  selector: 'app-tasks-list',
  standalone: true,
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
  imports: [TaskItemComponent, FormsModule],
  providers: [TaskFilterOptionsProvider]
})
export class TasksListComponent {
  readonly TASK_FILTER_OPTIONS = inject(TASK_FILTER_OPTIONS);
}
````
