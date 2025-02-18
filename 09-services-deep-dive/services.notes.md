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