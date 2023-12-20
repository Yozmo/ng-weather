export enum UnitTimes {
  Seconds = 'Seconds',
  Hours = 'Hours'
}

export interface CacheTimeState {
  unitTime: UnitTimes,
  amount: string,
}