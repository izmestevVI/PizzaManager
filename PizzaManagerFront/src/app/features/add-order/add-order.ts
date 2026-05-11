import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { LucideAngularModule, X, ChevronDown, Check, Trash2 } from 'lucide-angular';
import { ReactiveFormsModule, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { PizzaFacadeService } from '../../core/services/pizza.facade.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PizzaResponce, PizzaSize } from '../../core/models/pizza.model';
import { OrderItem } from './components/order-item/order-item';
import { CreateOrder, DeliveryType } from '../../core/models/order.model';
import { DictionaryFacadeService } from '../../core/services/dictionary.facade.service';
import { Customer } from '../../core/models/dictionaly.model';
import { OrderFacadeService } from '../../core/services/order.facade.service';
import { InputComponent } from '../../shared/ui-kit/input/input';
import { SelectButtonComponent } from '../../shared/ui-kit/select-button/select-button';
import { SelectButtonOption } from '../../shared/ui-kit/select-button/select-button.model';
import { SelectOption } from '../../shared/ui-kit/base/base-select-control';
import { SelectComponent } from '../../shared/ui-kit/select/select';
import { AutocompleteComponent } from '../../shared/ui-kit/autocomplete/autocomplete';
import { map, startWith } from 'rxjs';
import { OrderForm, PizzaOrder } from './add-order.model';
import { ButtonComponent } from '../../shared/ui-kit/button/button';

@Component({
  selector: 'app-add-order',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule,
    ScrollingModule,
    OrderItem,
    InputComponent,
    SelectButtonComponent,
    SelectComponent,
    AutocompleteComponent,
    ButtonComponent,
  ],
  templateUrl: './add-order.html',
  styleUrl: './add-order.css',
})
export class AddOrder implements OnInit {
  readonly X = X;
  readonly ChevronDown = ChevronDown;
  readonly Check = Check;
  readonly Trash2 = Trash2;
  private destroyRef = inject(DestroyRef);
  dialogRef = inject<DialogRef<string>>(DialogRef<string>);
  customersNameControl = new FormControl<string | null>({ value: null, disabled: true });
  data = inject(DIALOG_DATA);
  pizzaService = inject(PizzaFacadeService);
  pizzasSelectOption = toSignal(
    this.pizzaService.getPizzas().pipe(map(pizzas => pizzas.map((p): SelectOption<PizzaResponce> => ({ label: p.name, value: p })))),
  );
  dictionaryService = inject(DictionaryFacadeService);
  customersSelectOption = toSignal(
    this.dictionaryService.getCustomers().pipe(
      map(customers =>
        customers.map(
          (customer): SelectOption<Customer> => ({
            label: customer.phone,
            description: customer.name,
            value: customer,
          }),
        ),
      ),
    ),
  );
  customersName = signal<string>('');
  orderService = inject(OrderFacadeService);
  totalPrice = signal<number | null>(null);
  paymentOptions: SelectOption<string>[] = [
    { label: 'Наличные', value: 'cash', description: 'Оплата курьеру' },
    { label: 'Картой', value: 'card', description: 'Онлайн на сайте' },
  ];

  deliveryTypeOptions: SelectButtonOption<string>[] = [
    { value: 'delivery', label: 'Доставка' },
    { value: 'pickup', label: 'Самовывоз' },
  ];

  form = new FormGroup<OrderForm>({
    customer: new FormControl<Customer | null>(null, [Validators.required]),
    address: new FormControl<string | null>(null, [Validators.required]),
    deliveryType: new FormControl<DeliveryType | null>(null, [Validators.required]),
    addPizza: new FormControl<PizzaResponce | null>(null),
    pizzas: new FormArray<FormGroup<PizzaOrder>>([], [Validators.required, Validators.minLength(1)]),
    paymentType: new FormControl<string | null>(null, [Validators.required]),
  });

  readonly isFormInvalid = toSignal(
    this.form.statusChanges.pipe(
      startWith(this.form.status),
      map(status => status === 'INVALID'),
    ),
    { initialValue: this.form.invalid },
  );

  ngOnInit(): void {
    this._watchAddPizzaChanges();
    this._watchPizzasChanges();
    this._watchCustomerChanges();
  }

  private _watchAddPizzaChanges(): void {
    this.form.controls.addPizza.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      if (value) {
        const newPizzaForm = new FormGroup<PizzaOrder>({
          pizza: new FormControl<PizzaResponce | null>(value),
          pizzaSize: new FormControl<PizzaSize | null>(null, [Validators.required]),
          count: new FormControl<number | null>(1, [Validators.required]),
        });
        this.form.controls.pizzas.push(newPizzaForm);
        this.form.controls.addPizza.setValue(null);
      }
    });
  }

  private _watchPizzasChanges(): void {
    this.form.controls.pizzas.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(pizzas => {
      let total = 0;
      pizzas.forEach(pizzaOrder => {
        const pizza = pizzaOrder.pizza;
        const pizzaSize = pizzaOrder.pizzaSize;

        if (pizza && pizzaSize) {
          total += (pizza.variants.find(v => v.size === pizzaSize)?.price ?? 0) * (pizzaOrder.count ?? 0);
        }
      });
      this.totalPrice.set(total);
    });
  }

  private _watchCustomerChanges(): void {
    this.form.controls.customer.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(customer => {
      if (customer) {
        this.customersNameControl.setValue(customer.name);
        this.form.controls.address.setValue(customer.address, { emitEvent: false });
      } else {
        this.customersNameControl.setValue(null);
      }
    });
  }

  onPizzaDelete(index: number): void {
    this.form.controls.pizzas.removeAt(index);
  }

  addOder(): void {
    if (this.form.valid) {
      const orderData = this.form.value;
      const pizzas = orderData.pizzas;
      if (pizzas) {
        const payload: CreateOrder = {
          customerId: orderData.customer?.id ?? 0,
          address: orderData.address ?? '',
          deliveryType: orderData.deliveryType ?? 'delivery',
          items: pizzas.map(pizzaOrder => ({
            pizzaId: pizzaOrder.pizza?.id ?? 0,
            size: pizzaOrder.pizzaSize ?? 'M',
            count: pizzaOrder.count ?? 1,
          })),
        };
        this.orderService
          .addOrder(payload)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.orderService.refreshOrders();
              this.dialogRef.close();
            },
            error: error => {
              console.error('Error creating order:', error);
              // Optionally, show an error message to the user
            },
          });
      }
    }
  }

  customerDisplayFn = (customer: Customer): string => {
    return customer ? customer.phone : '';
  };
}
