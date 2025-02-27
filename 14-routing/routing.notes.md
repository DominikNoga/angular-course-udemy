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
  <a routerLink="./" [queryParams]="{order: 'asc'}">sort tasks</a>
</p>
````

In order to get this param we are using similar approach as with route params
````ts
class TasksList {
  // Same config as before must be applied
  order = input<SortOrder>();
  activatedRoute = inject(ActivatedRoute);
  order?: 'asc' | 'desc';

  ngOnInit() {
    activatedRoute.queryParams.subscribe({
      next: (params) => {
        this.order = params['order']
      }
    })
  }
}
````

### Static data to routes
We can pass some data to the routes. Like always we can access them either with input or with activated route
It can be used for:
- Passing some metadata like page title
- Setting role based access
- Passing api urls, and other stuff

````ts
export const routes: Route[] = [
  {
      path: '',
      component: NoTaskComponent,
      data: {
        title: 'Home',
        roles: ['all']
      }
  },
  {
      path: 'users/:userId',
      component: UserTasksComponent,
      children: userRoutes,
      data: {
        title: 'Users',
        roles: ['admin']
      }
  }
] as const;

````

### Dynamic data to routes (Resolvers)
Handle fetching and dynamic data in routes to keep components lean and clean.
Similar to static data fetching. But we use resolve property and pass a resolver function there.

````ts
// Defining the resolver function
export const resolveUsername: ResolveFn<string> = (activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) => {
    const usersService = inject(UsersService);
    const userId = activatedRoute.paramMap.get('userId');
    return usersService.users.find(user => user.id === userId)?.name || 'No user found';
};
// Passing this to the route
const routes = [
  // ...
  {
    path: 'users/:id',
    /*
      Configures when it will re-run
        always : Run on every execution.
        paramsChange: just route params change
        pathParamsChange : Rerun guards and resolvers when the path params change. This does not compare matrix or query parameters.
        paramsOrQueryParamsChange : Run when path, matrix, or query parameters change.
        pathParamsOrQueryParamsChange : Rerun guards and resolvers when the path params change or query params have changed. This does not include matrix parameters.
    */
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      username: resolveUsername
    }
  }
]
// Accessing this data in the component file
class Test {
  // Using input
  username = input();
  // using observables
  ngOnInit() {
    // It gives access both to resolved data and 
    this.activatedRoute.data.subscribe({
      next: (data) => {
        const username = data.username;
      }
    })
  }
}
````

### Updating page title with routes
We can adjust the title of our web page (the one showed on the browser card). For SEO reasons.
It can be either:
- static
````ts
const routes: Route[] = [
  {
    path: '',
    // ...
    title: 'EasyTask - Home'
  }
]
````
- dynamic
````ts
// We are passing a resolver to the title property
export const resolveTitle: ResolveFn<string> = (activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) => {
    return `${user.username}'s Tasks`;
};

const routes: Route[] = [
  {
    path: '',
    // ...
    title: resolveTitle
  }
]
````

### Route guards
Mechanism allowing to check wether navigating to specific route should be permitted or not.
They are applied with 'can' prefix. And they are added using functions nowdays, or classes back then.

````ts
const routes: Route[] = [
  {
    path: 'users/:userId',
    // ...
    canActivate: , // It is similar to match, but used before the component is loaded 
    canActivateChild:, // If we wanna activate this route and not it's child routes
    canDeactivate: , // Can user leave the current page?
    canMatch: [canMatchFn] // Most versatile guard -> decides wether the path passed to the url can be matched, more modern
  }
]
````

#### Creating the guard
````ts
// CanMatch
export const canMatchUserRoutes: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const router = inject(Router);
  const userId = segments[1].path;
  const usersService = inject(UsersService);
  if (usersService.users.some(user => user.id === userId)) {
    // Let the user in: return true / obesvable(true)
    return true;
  }

  // if user cannot access this route, redirect him / stay on this route / return an observable
  return new RedirectCommand(router.parseUrl('/unauthorized'));
};

// CanDeactivate
export const canLeaveNewTaskPage: CanDeactivateFn<NewTaskComponent> = (component: NewTaskComponent) => {
  if (component.enteredDate() || component.enteredSummary() || component.enteredTitle()) {
    return window.confirm('Are tou sure you want to leave? You will loose all the data');
  }
  return true;
}
````

### Programatic reload
If we want to update some data, and we need a reload. This is how we do it.

````ts
class TaskComponent {
  onComplete() {
    this.tasksService.removeTask(this.task().id);
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute, // thanks to that './' will be relative to the current route
      onSameUrlNavigation: 'reload', // we will mimic the reload behaviour but without really reloading the page
      queryParamsHandling: 'preserve' // query params won't get removed
    });
  }
}
````

## Lazy loading
What is it?

We are building the app in a way, that the code is only loaded and executed when it is really needed.
It leads to:
- smaller initial bundle size -> Hence app will load faster and work quicker
- also it does not load code that won't be used by some user. For example guest user won't ever need 'admin' page to be loaded

### Lazy loaded routes
Loads page only if a user will enter this page.
In order to use lazy loading instead of eager loading.
We need to use import key word as a function. Everything imported using typical syntax won't be loaded in a lazy way.
So any resolvers or stuff like that has to be kept in other place than the component if we want to use it in routes file.

<b>Warning:</b> should't be applied to each route without thinking. For example the home page will probably
be visited by every user, so it is better to load it right away

````ts
export const userRoutes: Routes = [
  // 
  {
    path: '',
    component: NoTaskComponent
  },
  {
    path: 'tasks',
    loadComponent: () => import('../tasks/tasks.component')
        .then(module => module.TasksComponent),
    runGuardsAndResolvers: 'always',
    resolve: {
      userTasks: userTasksResolver
    }
  }
];
````

#### Load route group lazily
We are using loadChildren instead of children and we can remove all lazy loading from child routes
````ts
export const routes: Route[] = [
    {
        path: '',
        component: NoTaskComponent
    },
    {
        path: 'users/:userId',
        component: UserTasksComponent,
        loadChildren: () => import('../app/users/users.routes')
            .then(m => m.userRoutes)
    }
] as const;
````

### Defferable views