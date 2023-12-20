import {Injectable, signal} from '@angular/core';
import { LOCATIONS } from 'app/constants/local-storage-keys';


@Injectable({
  providedIn: 'root',
})
export class LocationService {
  locations = signal<string[]>([]);

  constructor() {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString != null) {
      this.locations.set(JSON.parse(locString));
    }
  }

  addLocation(zipcode: string) {
    this.locations.update((currentLocations) => [...currentLocations, zipcode]);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations()));
  }

  removeLocation(zipcode: string) {
    this.locations.update((currentLocations) =>
      currentLocations.filter((location) => location !== zipcode),
    );

    if (this.locations().length) {
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations()));
    } else {
      localStorage.removeItem(LOCATIONS);
    }
  }
}
