import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { PizzaResponce, PizzaSize } from '../../core/models/pizza.model';
import { Customer } from '../../core/models/dictionaly.model';
import { DeliveryType } from '../../core/models/order.model';

export interface PizzaOrder {
  pizza: FormControl<PizzaResponce | null>;
  pizzaSize: FormControl<PizzaSize | null>;
  count: FormControl<number | null>;
}
export interface OrderForm {
  customer: FormControl<Customer | null>;
  address: FormControl<string | null>;
  deliveryType: FormControl<DeliveryType | null>;
  addPizza: FormControl<PizzaResponce | null>;
  pizzas: FormArray<FormGroup<PizzaOrder>>;
  paymentType: FormControl<string | null>;
}
