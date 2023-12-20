import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CacheTimeState, UnitTimes} from './unit-times';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { CacheTimeService } from 'app/services/cache-time.service';

@Component({
    selector: 'app-cache-time-picker',
    templateUrl: './cache-time-picker.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class CacheTimePickerComponent {
  private cacheTimeService = inject(CacheTimeService);

  unitTimes = [UnitTimes.Seconds, UnitTimes.Hours];

  cacheTimePickerForm = new FormGroup({
    unitTime: new FormControl<UnitTimes>(UnitTimes.Seconds, Validators.required),
    amount: new FormControl<string>('', Validators.required),
  });

  constructor() {
    this.cacheTimePickerForm.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(500))
      .subscribe((value) => {
        if (value.amount && value.unitTime) {
          this.cacheTimeService.cacheTimeState = value as CacheTimeState;
        }
      });
  }
}
