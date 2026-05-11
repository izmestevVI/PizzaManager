import { Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { LucideAngularModule, Trash2 } from 'lucide-angular';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonOption } from '../../../../shared/ui-kit/select-button/select-button.model';
import { SelectButtonComponent } from "../../../../shared/ui-kit/select-button/select-button";
import { PizzaOrder } from '../../add-order.model';
import { InputComponent } from "../../../../shared/ui-kit/input/input";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PizzaSize } from '../../../../core/models/pizza.model';

@Component({
  selector: '[app-order-item]',
  imports: [ReactiveFormsModule, LucideAngularModule, MatButtonToggleModule, MatButtonToggleModule, SelectButtonComponent, InputComponent],
  templateUrl: './order-item.html',
  styleUrl: './order-item.css',
})
export class OrderItem implements OnInit {
  readonly Trash2 = Trash2;
  private destroyRef = inject(DestroyRef);
  pizzaOrderFormGroup = input.required<FormGroup<PizzaOrder>>({ alias: 'app-order-item' });
  index = input.required<number>();
  deleteOrder = output()
  price = signal<number | null>(null);

  sizes = computed(() => {
    const variants = this.pizzaOrderFormGroup().controls.pizza.value?.variants;
    return variants ? variants.map((v): SelectButtonOption<PizzaSize> => ({ label: `[${v.size}]`, value: v.size })) : [];
  })

  ngOnInit(): void {
    this.pizzaOrderFormGroup().controls.pizzaSize.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(pizzaSize => {
      if (pizzaSize) {
        const pizza = this.pizzaOrderFormGroup().controls.pizza.value;
        const price = pizza ? pizza.variants.find(v => v.size === pizzaSize)?.price ?? null : null;
        this.price.set(price);
      } else {
        this.price.set(null);
      }
    });
  }
}
