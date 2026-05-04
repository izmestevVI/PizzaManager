import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWaiting } from './card-waiting';

describe('CardWaiting', () => {
  let component: CardWaiting;
  let fixture: ComponentFixture<CardWaiting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardWaiting],
    }).compileComponents();

    fixture = TestBed.createComponent(CardWaiting);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
