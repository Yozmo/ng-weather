import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {LocationService} from '../services/location.service';
import {WeatherService} from 'app/services/weather.service';
import {take} from 'rxjs';
import {FormControl, Validators, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class ZipcodeEntryComponent {
  private locationService = inject(LocationService);
  private weatherService = inject(WeatherService);
  zipcodeControl = new FormControl<string>('', [Validators.pattern(/^\d+$/), Validators.required]);

  addLocation(zipcode: string) {
    if (!this.locationService.locations().includes(zipcode)) {
      this.zipcodeControl.reset();
      this.weatherService.addCurrentConditions(zipcode).pipe(take(1)).subscribe();
    }
  }
}
