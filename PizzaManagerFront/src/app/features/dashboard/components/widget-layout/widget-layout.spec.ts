import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetLayout } from './widget-layout';

describe('WidgetLayout', () => {
  let component: WidgetLayout;
  let fixture: ComponentFixture<WidgetLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
