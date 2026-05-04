import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetLatestOrders } from './widget-latest-orders';

describe('WidgetLatestOrders', () => {
  let component: WidgetLatestOrders;
  let fixture: ComponentFixture<WidgetLatestOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetLatestOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetLatestOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
