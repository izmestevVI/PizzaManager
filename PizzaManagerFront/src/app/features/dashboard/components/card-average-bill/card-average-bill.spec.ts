import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAverageBill } from './card-average-bill';

describe('CardAverageBill', () => {
  let component: CardAverageBill;
  let fixture: ComponentFixture<CardAverageBill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAverageBill],
    }).compileComponents();

    fixture = TestBed.createComponent(CardAverageBill);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
