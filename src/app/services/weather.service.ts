import {Injectable, WritableSignal, inject, signal} from '@angular/core';
import {Observable, map} from 'rxjs';

import {HttpClient, HttpParams} from '@angular/common/http';
import {CurrentConditions} from '../current-conditions/current-conditions.type';
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {ForecastWithZip, Forecast} from '../forecasts-list/forecast.type';
import { FORECAST, WEATHERS } from 'app/constants/local-storage-keys';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL =
    'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);
  private http = inject(HttpClient);

  addCurrentConditions(zipcode: string): Observable<CurrentConditions> {
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    let params = new HttpParams()
      .set('zip', `${zipcode},us`)
      .set('units', 'imperial')
      .set('APPID', WeatherService.APPID);

    return this.http
      .get<CurrentConditions>(`${WeatherService.URL}/weather`, {
        params: params,
      });
  }

  storeCurrentConditionOrForecast<T>(weatherOrForecast: T[], source: string) {
    if (source === WEATHERS) {
      this.currentConditions.set(weatherOrForecast as ConditionsAndZip[]);
    }
    localStorage.setItem(source, JSON.stringify(weatherOrForecast));
  }

  removeCurrentConditionsAndForecast(zipcode: string) {
    const forecastsStr = localStorage.getItem(FORECAST);
    this.currentConditions.update((conditions) =>
      conditions.filter((condition) => condition.zip !== zipcode),
    );
    if (this.currentConditions().length) {
      if (forecastsStr != null) {
        let forecasts = JSON.parse(forecastsStr);
        forecasts = forecasts.filter((forecast: ForecastWithZip) => forecast.zip !== zipcode);
        localStorage.setItem(FORECAST, JSON.stringify(forecasts));
      }
      localStorage.setItem(WEATHERS, JSON.stringify(this.currentConditions()));
    } else {
      localStorage.removeItem(WEATHERS);
      localStorage.removeItem(FORECAST);
    }
  }

  getCurrentConditions(): WritableSignal<ConditionsAndZip[]> {
    return this.currentConditions;
  }

  getForecast(zipcode: string): Observable<ForecastWithZip> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    let params = new HttpParams()
      .set('zip', `${zipcode},us`)
      .set('units', 'imperial')
      .set('cnt', '5')
      .set('APPID', WeatherService.APPID);
    return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily`, {params: params})
    .pipe(map((response) => ({
      zip: zipcode,
      data: response,
    })));
  }

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) return WeatherService.ICON_URL + 'art_storm.png';
    else if (id >= 501 && id <= 511) return WeatherService.ICON_URL + 'art_rain.png';
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + 'art_light_rain.png';
    else if (id >= 600 && id <= 622) return WeatherService.ICON_URL + 'art_snow.png';
    else if (id >= 801 && id <= 804) return WeatherService.ICON_URL + 'art_clouds.png';
    else if (id === 741 || id === 761) return WeatherService.ICON_URL + 'art_fog.png';
    else return WeatherService.ICON_URL + 'art_clear.png';
  }
}
