import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { map } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  httpClient = inject(HttpClient);
  isFetching = signal(false);
  placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  places = this.placesService.userPlaces;

  ngOnInit(): void {
    this.isFetching.set(true);
    const sub = this.placesService.loadUserPlaces()
      .subscribe({
        complete: () => {
          this.isFetching.set(false);
        }
      });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  removePlace(place: Place) {
    this.placesService.removeUserPlace(place)
      .subscribe();
  }
}
