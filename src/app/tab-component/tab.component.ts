import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  booleanAttribute,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-tab',
  template: `
    @if (isActive) {
      <ng-content></ng-content>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TabComponent {
  private currentActiveTab = signal(false);

  @Input({required: true}) tabTitle!: string;
  @Input({required: true}) tabId!: string;

  @Input({transform: booleanAttribute}) set active(value: boolean) {
    if (value) {
      this.currentActiveTab.set(value);
    }
  }

  set isActive(active: boolean) {
    if (this.currentActiveTab() !== active) {
      this.currentActiveTab.set(active);
    }
  }

  @HostBinding('class.is-active')
  get isActive() {
    return this.currentActiveTab();
  }
}
