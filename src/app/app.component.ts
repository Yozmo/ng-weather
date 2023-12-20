import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TIMESTAMP } from './constants/local-storage-keys';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent {

    constructor() {
        const timestampStr = localStorage.getItem(TIMESTAMP);
        // If the cace is invalid, clear the localStorage
        if (timestampStr && parseInt(timestampStr) < Date.now()) {
            localStorage.clear();
        }
    }
}
