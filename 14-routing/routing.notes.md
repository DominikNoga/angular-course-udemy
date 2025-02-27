# Routing
Updating the UI and address bar, as the page changes

## SPA
Single Page Application -> App which uses just one html file, which loads whole app code.

## Routing in Angular
### Setup
- To setup routing between multiple pages we need to provide it in the main.ts file
- The common idea behind routing is setting them up in the 'app.routes.ts' file next to the app.component
- The configuration passed to the main.ts file is stored in 'app.config.ts' file

````ts
// app.routes.ts
export const routes: Route[] = [
    {
        path: '',
        component: NoTaskComponent
    },
    {
        path: 'tasks',
        component: TasksComponent
    }
] as const;

// app.config.ts
export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes)
    ]
} as const;

// main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
````

# Router outlet
This is a special tag where your routes will go.
It is a marker showing where to inject the content.
We need to import RoutingModule into the component.
````html
<main>
  <app-users />

  <div>
    <router-outlet />
  </div>
</main>

````

### Navigation
We are not using the href tag in order to navigate between pages.
Because it re-fetches all application and reloads the page.

Instead we are using the routerLink directive, which has to be imported into our component.

````html
<div>
  <a routerLink="/tasks" >
    <img [src]="imagePath()" [alt]="user().name" />
    <span>{{ user().name }}</span>
  </a>
</div>
````

### Styling selected route
With help of special routerLinkActive directive. (As always import the directive)

````html
<div>
  <!-- selected is a class to be injected -->
  <a [routerLink]="['/users', user().id]" routerLinkActive="selected">
    <img [src]="imagePath()" [alt]="user().name" />
    <span>{{ user().name }}</span>
  </a>
</div>

````

### Route params / dynamic routes
In order to pass something to the route (like id or sth else).
We use a route params. Which are configured in routes object.

````ts
export const routes: Route[] = [
    {
        path: '',
        component: NoTaskComponent
    },
    {
        path: 'users/:userId', // ':userId' will be replaced by the string with id
        component: UserTasksComponent
    }
] as const;
````
In order to navigate there we have to bind the router-link, there are two ways
````html
<a [routerLink]="'/users/' + user.id"></a>
<!-- Each array item is a route part -->
<a [routerLink]="['users', user.id]"></a> 
````

#### Getting route params
1. We can handle this using the regular input function, by using input with the same name as the routeParam.
It requires modifying the provider a bit.

````ts
// app.config.ts
export const appConfig: ApplicationConfig = {
    providers: [
      // this withComponentInputBinding has to be added
        provideRouter(routes, withComponentInputBinding())
    ]
} as const;
// extracting param
class UserTasks {
  userId = input.required<string>();
}
````

2. In older angular versions, where signals were not used. We use the activatedRoute service.

````ts
export class UserTasksComponent implements OnInit {
  // We are injecting this into our component
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    // this object gives us multiple observables
    // one of them is paramMap which stores params in a map with keys specified in routes array. 'userId' here
    this.activatedRoute.paramMap.subscribe({
      next: paramMap => {
        const userId = paramMap.get('userId');
        const userName = this.usersService.users.find(user => user.id === userId)?.name || '';
      }
    });
  }
}
````
activatedRoute.snapshot -> object which almost mimics the activatedRoute. But it have an access to the 
params object. And does not require you to set up the subscription. But it is NOT reactive it won't change if the route param changes.
So it is very good if we know that the param won't change.

<b>Use case:</b> When we load the component just once and destroy it when we change the param.
For example redirect from users/3 to users/44 will cause destroying the component and re-render

````ts
export class UserTasksComponent implements OnInit {
  // We are injecting this into our component
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    // Access without the subscription, won't change if param will change
    const id = this.activatedRoute.snapshot.params.userId
  }
}
````

### Nested routes
Router outlet is needed in the parent component!!!
````ts
export const routes: Route[] = [
    {
        path: 'users/:userId',
        component: UserTasksComponent,
        children: [
            {
                path: 'tasks', // it will be automatically concatenated with users/userId
                component: TasksComponent
            }
        ]
    }
] as const;
````
````html
<section id="tasks">
  <header>
    <h2>{{userName()}} Tasks</h2>
    <menu>
      <!-- From parent component we can navigate simply to child components -->
      <!-- It will be concatenated -->
      <a routerLink="tasks/new">Add Task</a>
    </menu>
  </header>

  <router-outlet />
</section>
````

#### Route params for child routes.
  - it works easily with the activated route
  - For input method it requires some extra config
  ````ts
    export const appConfig: ApplicationConfig = {
      providers: [
          provideRouter(routes, withComponentInputBinding(), withRouterConfig({
              paramsInheritanceStrategy: 'always'
          }))
      ]
    } as const;
  ````
#### Relative navigation
````html
<p class="actions">
  <!-- Releative navigation to one route back -->
    <!-- from users/id/tasks/new to users/id/tasks -->
  <a routerLink="../">Cancel</a>
  <button type="submit">Create</button>
</p>

<!-- ./ indicates we wann stay on the current page or build the link starting with the current page -->
<a routerLink='./tasks'></a>
````

### Programatic navigation
When we navigate after some action and we do it in the code. We do it via the
Router Service.

````ts
class NewTask {
  onSubmit() {
    this.tasksService.addTask(
      {
        title: this.enteredTitle(),
        summary: this.enteredSummary(),
        date: this.enteredDate(),
      },
      this.userId()
    );

    this.router.navigate(['users', this.userId(), 'tasks'], {
      replaceUrl: true // make sure it works as the redirect, in order to prevent going back to the same page
    });
  }
}
````

### Fallback not found route
````ts
export const routes: Route[] = [
    {
        path: '',
        component: NoTaskComponent
    },
    {
        // Last route which will be used for any not known route
        path: '**',
        component: NotFoundComponent
    }
] as const;
````

### Redirect to other route
If some parent route, does not provide any component itself.
Like administration in openlmis or user/id here. We can redirect the user to the child route.
Or any other, like home page if we want.

````ts
/*
  pathMatch => 
    - prefix (Default) -> this will look at the path with redirect, with all it parent routes and checks
      if url entered in browser STARTS with this path, it is faster but not good for example below.
    - full -> Checks is the full entered path matches the redirect route path
  IMPORTANT for redirect from 
  root '' path, because for prefix we wiil have infinite redirect, because every route starts with an empty string
*/
export const routes: Route[] = [
    {
        path: 'users/:userId',
        component: UserTasksComponent,
        children: [
            {
                path: '',
                // '/tasks' !== 'tasks' -> first one is an absolute path, second one is relative
                redirectTo: 'tasks',
                pathMatch: 'prefix'
            }
            {
                path: 'tasks', 
                component: TasksComponent
            }
        ]
    },
] as const;
````

### Query parameters
Extra piece that we can add to the url that allows sharing the route and modifying it for given params.
For example sorting the table.

#### Adding query params
Happens by adding queryParamters attribute to the <a> tag.
It is just the key value pairs where key would be 'sort' and value 'asc' or 'desc'

````html
<p>
  <a routerLink="./" [queryParams]="queryParams">sort tasks</a>
</p>
````