import {ChangeDetectionStrategy, Component} from '@angular/core';
import { CurrentConditionsComponent } from '../current-conditions/current-conditions.component';
import { ZipcodeEntryComponent } from '../zipcode-entry/zipcode-entry.component';
import { CacheTimePickerComponent } from '../cache-time-picker/cache-time-picker.component';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CacheTimePickerComponent,
        ZipcodeEntryComponent,
        CurrentConditionsComponent,
    ],
})
export class MainPageComponent {}
