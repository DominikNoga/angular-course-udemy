# Angular with a BE
We are not talking to the db in browser, this would be ineffecient and insecure.
Therefore we want to connect our FE with some kind of API or server.
## Providing httpClient
We are providing the http client for the sandalone components app in the main.ts file

````ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
    providers: [provideHttpClient()]
}).catch((err) => console.error(err));
````

## Sending HTTP requests

````ts
export class AvailablePlacesComponent implements OnInit {
  httpClient = inject(HttpClient);
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isFetching.set(true);
    const sub = this.httpClient.get<{places: Place[]}>('http://localhost:3000/places', {
      observe: 'body', // response (fullResponse object) | body (just response body) | events (all events that occur during the request sending and response receiving)
    })
      .pipe(
        map((response) => response.places),
        catchError((error) => { // We can catch error here, do sth with it
          console.log(error);
          return throwError(() => new Error('something went wrong')); // the handled error is gone, so we need to throw it again if we want to use it in error function
          // useful if we want to have two separate logics for this error handling
          // useful when we want to return a different data when something failed (for example cached one)
        })
      )
      .subscribe({
        next: (places) => {
          console.log(places);
          this.places.set(places);
        },
        complete: () => {
          this.isFetching.set(false);
        },
        error: (err: Error) => {
            console.log(err.message);
        },
      });
  }

  onSelectPlace(place: Place) {
    this.httpClient.put<UserPlaceDTO>('http://localhost:3000/user-places', {
      placeId: place.id
    }).subscribe();
  }
}
````

## Updating the shared value inside the service
Threre are several ways of updating some shared variable.
Here i will show 2 of them. The shared value is a signal which stores userPlaces.

### Optimistic update
In optimistic update we are updating the variable before the request has even been sent.

The upside here is the possibility to show user the update right away instead of waiting for the response.

It is nice for the long going requests.

The downside is that we are performing some unnecessary operations, like checking for place existance, 
or handling a backup.
````ts
class PlacesService {
  userPlaces$ = signal([]);

  removeUserPlace(place: Place) {
    const prevPlaces = this.userPlaces$();

    if (prevPlaces.some(p => p.id === place.id)) {
      this.userPlaces$.update(prevPlaces => {
        return prevPlaces.filter(p => p.id !== place.id)
      });
    }

    return this.httpClient.delete<UserPlacesResponse>(`${this.BASE_URL}/user-places/${place.id}`)
      .pipe(
        catchError(error => {
          const msg = 'Failed to remove this place';
          // backup if sth happened
          this.userPlaces$.set(prevPlaces);
          this.errorService.showError(msg);
          return throwError(() => new Error(msg));
        })
      );
  }
}
````

### Update after response
In this approach we are updating the variable, after the observable has passed the next value.

The upside is less code, and no need for removing things from UI.

Downside is, we need to wait for the request to answer.

````ts
class PlacesService {
  userPlaces$ = signal([]);

  addPlaceToUserPlaces(place: Place) {
    return this.httpClient.put<UserPlacesResponse>(`${this.BASE_URL}/user-places`, {
      placeId: place.id
    }).pipe(
      map((response) => response.userPlaces),
      tap({
        next: (userPlaces) => {
          this.userPlaces$.set(userPlaces);
        }
      })
    );
  }
}
````

## Interceptors
Allows to get the http request and do sth with it.

### How to create?
````ts
function loggingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    console.log('[Outgoing request]');
    console.log(request);
    return next(request);
}

bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(
        withInterceptors([loggingInterceptor])
    )]
}).catch((err) => console.error(err));
````

### Common use-cases
- Adding the authorization token
````ts
const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authToken = localStorage.getItem('token'); // Get token from storage
  const clonedRequest = request.clone({
    setHeaders: { Authorization: `Bearer ${authToken}` }
  });

  return next(clonedRequest);
};
````

- Handling error globally
````ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const errorInterceptor: HttpInterceptorFn = (request, next) => {
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`[Error] ${error.status} - ${error.message}`);
      alert('An error occurred. Please try again later.');
      return throwError(() => error);
    })
  );
};
````

- Handling the loading state
````ts
import { BehaviorSubject } from 'rxjs';

const isLoading = new BehaviorSubject<boolean>(false);

const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  isLoading.next(true);
  
  return next(request).pipe(
    finalize(() => isLoading.next(false))
  );
};

````

- Modifying the request, for example the url based on the current env: UAT, prod, dev
````ts
const baseUrl = env.isProd ? 'https://api.example.com' : 'http://localhost:3000';

const baseUrlInterceptor: HttpInterceptorFn = (request, next) => {
  const modifiedRequest = request.clone({
    url: `${baseUrl}${request.url}`
  });
  
  return next(modifiedRequest);
};
````

### Response interceptors
````ts

````