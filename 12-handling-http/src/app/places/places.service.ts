import { inject, Injectable, signal } from '@angular/core';

import { Place, UserPlacesResponse } from './place.model';
import { catchError, map, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../shared/error.service';

type AllowedEndpoints = 'places' | 'user-places';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private readonly BASE_URL = 'http://localhost:3000';
  private errorService = inject(ErrorService);
  private httpClient = inject(HttpClient);
  private places$ = signal<Place[]>([]);
  places = this.places$.asReadonly();
  private userPlaces$ = signal<Place[]>([]);
  userPlaces = this.userPlaces$.asReadonly();

  private getPlaces(endpoint: AllowedEndpoints) {
    return this.httpClient.get<{ places: Place[] }>(`${this.BASE_URL}/${endpoint}`)
      .pipe(
        map((response) => response.places),
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error('something went wrong'));
        })
      );
  }

  loadAvailablePlaces() {
    return this.getPlaces('places');
  }

  loadUserPlaces() {
    return this.getPlaces('user-places')
      .pipe(
        tap({
          next: (places) => {
            this.userPlaces$.set(places);
          }
        })
      );
  }

  addPlaceToUserPlaces(place: Place) {
    return this.httpClient.put<UserPlacesResponse>(`${this.BASE_URL}/user-places`, {
      placeId: place.id
    }).pipe(
      catchError((error) => {
        this.errorService.showError(`Something went wrong\n${error.message}`);
        return throwError(() => new Error('something went wrong'));
      }),
      map((response) => response.userPlaces),
      tap({
        next: (userPlaces) => {
          this.userPlaces$.set(userPlaces);
        }
      })
    );
  }

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
