import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place, UserPlaceDTO } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
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

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  onSelectPlace(place: Place) {
    this.httpClient.put<UserPlaceDTO>('http://localhost:3000/user-places', {
      placeId: place.id
    }).subscribe();
  }
}
