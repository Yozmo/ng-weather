import {ChangeDetectionStrategy, Component, inject, Signal, WritableSignal} from '@angular/core';
import {WeatherService} from '../services/weather.service';
import {LocationService} from '../services/location.service';
import { Router, RouterLink } from '@angular/router';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import { TabComponent } from '../tab-component/tab.component';
import { DecimalPipe } from '@angular/common';
import { TabsComponent } from '../tab-component/tabs.component';
import { WEATHERS } from 'app/constants/local-storage-keys';

@Component({
    selector: 'app-current-conditions',
    templateUrl: './current-conditions.component.html',
    styleUrls: ['./current-conditions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        TabsComponent,
        TabComponent,
        RouterLink,
        DecimalPipe,
    ],
})
export class CurrentConditionsComponent {
  protected weatherService = inject(WeatherService);
  private router = inject(Router);
  private locationService = inject(LocationService);

  currentConditionsByZip: WritableSignal<ConditionsAndZip[]> =
    this.weatherService.getCurrentConditions();

  constructor() {
    const weatherString = localStorage.getItem(WEATHERS);
    if (weatherString != null && !this.currentConditionsByZip().length) {
      this.currentConditionsByZip.set(JSON.parse(weatherString));
    }
  }

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }

  removeLocation(zipcode: string) {
    this.locationService.removeLocation(zipcode);
    this.weatherService.removeCurrentConditionsAndForecast(zipcode);
  }
}
