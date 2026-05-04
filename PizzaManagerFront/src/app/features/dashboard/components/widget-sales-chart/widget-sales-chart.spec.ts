import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSalesChart } from './widget-sales-chart';

describe('WidgetSalesChart', () => {
  let component: WidgetSalesChart;
  let fixture: ComponentFixture<WidgetSalesChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetSalesChart],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetSalesChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
