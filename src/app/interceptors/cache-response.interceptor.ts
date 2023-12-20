import {HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {ConditionsAndZip} from 'app/conditions-and-zip.type';
import {FORECAST, LOCATIONS, TIMESTAMP, WEATHERS} from 'app/constants/local-storage-keys';
import {ForecastWithZip} from 'app/forecasts-list/forecast.type';
import {CacheTimeService} from 'app/services/cache-time.service';
import {LocationService} from 'app/services/location.service';
import {WeatherService} from 'app/services/weather.service';
import {of, tap} from 'rxjs';

type LocalDataStorageType<T> = T extends 'weathers' ? ConditionsAndZip : ForecastWithZip;

export const cacheResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const locationService = inject(LocationService);
  const weatherService = inject(WeatherService);
  const cacheTimeService = inject(CacheTimeService);

  const zipcode = req.params.get('zip')!.split(',')[0]; // the parameters are send as `?zip=10001,us
  const locations = localStorage.getItem(LOCATIONS);
  const timestamp = localStorage.getItem(TIMESTAMP);
  const source = req.url.includes('/weather')
    ? WEATHERS
    : req.url.includes('/forecast')
      ? FORECAST
      : null;

  if (source) {
    const weatherOrForecast = localStorage.getItem(source);

    // No entries at all
    if (!locations || !weatherOrForecast) {
      return next(req).pipe(
        tap((response) => {
          if (response instanceof HttpResponse) {
            const data: LocalDataStorageType<typeof source> = {
              zip: zipcode,
              data: response.body as any,
            };
            // In case of forecasts, we laready have the location stored.
            // Check if we need to store or not the location.
            !locations && locationService.addLocation(zipcode);
            weatherService.storeCurrentConditionOrForecast([data], source);
            localStorage.setItem(TIMESTAMP, cacheTimeService.timestamp().toString());
          }
        }),
      );
    } else {
      // Check the timestamp of the entries, if there are some
      let weatherOrForecastData: LocalDataStorageType<typeof source>[] =
        JSON.parse(weatherOrForecast);
      const locationData: string[] = JSON.parse(locations);
      // if the weathers endpoint is called we're looking to see if this is a new location
      // otherwise we're looking to see if we already know the conditions for this location and we
      // want the forecast
      const index =
        source === WEATHERS
          ? locationData.findIndex((el) => el === zipcode)
          : weatherOrForecastData.findIndex(
              (el) => el.zip === locationData[locationData.length - 1],
            );

      // If we have a new zipcode or new forecast, save it.
      if (index === -1) {
        return next(req).pipe(
          tap((response) => {
            if (response instanceof HttpResponse) {
              const data: LocalDataStorageType<typeof source> = {
                zip: zipcode,
                data: response.body as any,
              };
              // save new zipcode
              source === WEATHERS && locationService.addLocation(zipcode);
              weatherService.storeCurrentConditionOrForecast(
                [...weatherOrForecastData, data],
                source,
              );

              // The timestamp can gen invalidated if the timestamp passes
              // while staying with the application opened and at some point
              // trying to add a new entry which is not cached.
              if (timestamp && +timestamp < Date.now()) {
                cacheTimeService.updateExpiredTimestamp();
              }
            }
          }),
        );
      }

      // More than x seconds/hours passed
      if (timestamp && +timestamp < Date.now()) {
        return next(req).pipe(
          tap((response) => {
            if (response instanceof HttpResponse) {
              const data: LocalDataStorageType<typeof source> = {
                zip: zipcode,
                data: response.body as any,
              };
              weatherOrForecastData[index] = data;
              cacheTimeService.updateExpiredTimestamp();
              locationService.addLocation(zipcode);
              weatherService.storeCurrentConditionOrForecast(weatherOrForecastData, source);
              localStorage.setItem(TIMESTAMP, cacheTimeService.timestamp().toString());
            }
          }),
        );
      } else {
        // return cached data
        return of(
          new HttpResponse({
            body: weatherOrForecastData.find((el) => el.zip === zipcode)!.data,
          }),
        );
      }
    }
  }
  return next(req);
};
