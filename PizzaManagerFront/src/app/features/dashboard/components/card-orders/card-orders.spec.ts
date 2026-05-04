import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOrders } from './card-orders';

describe('CardOrders', () => {
  let component: CardOrders;
  let fixture: ComponentFixture<CardOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(CardOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
