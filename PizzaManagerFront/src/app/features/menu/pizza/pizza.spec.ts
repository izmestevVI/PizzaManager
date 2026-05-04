import { ComponentFixture, TestBed } from '@angular/core/testing';
import {describe, it, beforeEach} from 'vitest'

import { PizzaComponent } from './pizza';

describe('Pizza', () => {
  let component: PizzaComponent;
  let fixture: ComponentFixture<PizzaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PizzaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PizzaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
