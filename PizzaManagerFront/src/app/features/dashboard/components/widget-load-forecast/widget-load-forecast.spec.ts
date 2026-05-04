import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetLoadForecast } from './widget-load-forecast';

describe('WidgetLoadForecast', () => {
  let component: WidgetLoadForecast;
  let fixture: ComponentFixture<WidgetLoadForecast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetLoadForecast],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetLoadForecast);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
