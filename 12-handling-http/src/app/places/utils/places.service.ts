import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PlacesService {
    private httpClient = inject(HttpClient);

    private get<T>(endpoint: string) {
        return this.httpClient.get<T>(endpoint)
            .subscribe()
    }

    getPlaces() {}

    getUserPlaces() {}

    setUserPlace(placeId: string) {

    }
}