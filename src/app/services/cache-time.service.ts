import {Injectable, computed, signal} from '@angular/core';
import {CacheTimeState, UnitTimes} from 'app/cache-time-picker/unit-times';

@Injectable({
  providedIn: 'root',
})
export class CacheTimeService {
  private _cacheTimeState = signal<CacheTimeState | null>(null);

  timestamp = computed(() => {
    if (this._cacheTimeState() === null) {
      return 0;
    }

    const {unitTime, amount} = this._cacheTimeState()!;
    const now = new Date();

    if (unitTime === UnitTimes.Seconds) {
      return now.setSeconds(now.getSeconds() + parseInt(amount));
    } else {
      return now.setHours(now.getHours() + parseInt(amount));
    }
  });

  set cacheTimeState(value: CacheTimeState) {
    this._cacheTimeState.set(value);
  }

  updateExpiredTimestamp() {
    this._cacheTimeState.update((state) => ({...state!, amount: Date.now().toString()}));
  }
}
