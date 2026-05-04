import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetLatestOrdersItem } from './widget-latest-orders-item';

describe('WidgetLatestOrdersItem', () => {
  let component: WidgetLatestOrdersItem;
  let fixture: ComponentFixture<WidgetLatestOrdersItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetLatestOrdersItem],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetLatestOrdersItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
