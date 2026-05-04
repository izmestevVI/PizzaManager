import { ComponentFixture, TestBed } from '@angular/core/testing';
import {describe, it, beforeEach} from 'vitest'
import { CardRevenue } from './card-revenue';

describe('CardRevenue', () => {
  let component: CardRevenue;
  let fixture: ComponentFixture<CardRevenue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRevenue],
    }).compileComponents();

    fixture = TestBed.createComponent(CardRevenue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
