import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetTopPizzas } from './widget-top-pizzas';

describe('WidgetTopPizzas', () => {
  let component: WidgetTopPizzas;
  let fixture: ComponentFixture<WidgetTopPizzas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetTopPizzas],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetTopPizzas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
