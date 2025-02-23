import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  httpClient = inject(HttpClient);
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isFetching.set(true);
    const sub = this.httpClient.get<{places: Place[]}>('http://localhost:3000/user-places')
      .pipe(
        map((response: {places: Place[]}) => response.places)
      )
      .subscribe({
        next: (places) => {
          console.log(places);
          this.places.set(places);
        },
        complete: () => {
          this.isFetching.set(false);
        }
      });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }
}
