import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  Output,
  QueryList,
  booleanAttribute,
  EventEmitter,
  AfterContentInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import {TabComponent} from './tab.component';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class TabsComponent implements AfterContentInit {
  private cdr = inject(ChangeDetectorRef);
  activeTabId: string | null = null;
  
  @Input({transform: booleanAttribute}) withAction = false;
  @Output() action = new EventEmitter<string>();

  @ContentChildren(TabComponent, {descendants: true})
  tabComponents: QueryList<TabComponent> | null = null;

  ngAfterContentInit(): void {
    this.tabComponents?.changes.subscribe(() => this.cdr.markForCheck());
  }

  onTabClick(zipcode: string) {
    if (zipcode !== this.activeTabId) {
      this.activeTabId = zipcode;
      this.setActiveTab(zipcode);
    }
  }

  actionClicked(zipcode: string) {
    this.action.emit(zipcode);
  }

  private setActiveTab(zipcode: string) {
    this.tabComponents!.forEach(
      (tabComponent) => (tabComponent.isActive = tabComponent.tabId === zipcode),
    );
  }
}
