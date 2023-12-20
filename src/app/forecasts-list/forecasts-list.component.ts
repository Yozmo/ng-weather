import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {switchMap, tap} from 'rxjs';
import {WeatherService} from '../services/weather.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgIf, NgFor, DecimalPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe],
})
export class ForecastsListComponent {
  private route = inject(ActivatedRoute);
  private wheatherService = inject(WeatherService);

  forecast = toSignal(
    this.route.params.pipe(
      switchMap((params) => this.wheatherService.getForecast(params['zipcode'])),
    ),
    {initialValue: null},
  );

  getWeatherIcon(id: number): string {
    return this.wheatherService.getWeatherIcon(id);
  }
}
