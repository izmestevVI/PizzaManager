import { Component, DestroyRef, effect, inject } from '@angular/core';
import { LucideAngularModule, Search, Plus, Pen, Trash2 } from 'lucide-angular';
import { PizzaFacadeService } from '../../core/services/pizza.facade.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MenuItem } from "./components/menu-item/menu-item";
import { Subject, switchMap } from 'rxjs';
import { SelectComponent } from "../../shared/ui-kit/select/select";
import { SelectOption } from '../../shared/ui-kit/base/base-select-control';
import { SelectButtonComponent } from "../../shared/ui-kit/select-button/select-button";
import { SelectButtonOption } from '../../shared/ui-kit/select-button/select-button.model';
import { InputComponent } from "../../shared/ui-kit/input/input";
import { RouterLink } from "@angular/router";
import { ButtonComponent } from "../../shared/ui-kit/button/button";

@Component({
  selector: 'app-menu',
  imports: [LucideAngularModule, MenuItem, SelectComponent, SelectButtonComponent, InputComponent, RouterLink, ButtonComponent],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  readonly Search = Search;
  readonly Plus = Plus;
  readonly Pen = Pen;
  readonly Trash2 = Trash2;
  categoryOptions: SelectOption<string>[] = [
    { label: 'Все', value: 'all' },
    { label: 'Мясные', value: 'meat' },
    { label: 'Вегетарианские', value: 'vegetarian' }
  ];
  filterOptoins: SelectButtonOption<string>[] = [
    { label: 'Все', value: 'all' },
    { label: 'В наличии', value: 'available' },
    { label: 'В стоп-листе', value: 'stoplist' }
  ]
  private destroyRef = inject(DestroyRef);
  pizzaService = inject(PizzaFacadeService);
  isRefresh = new Subject<void>();
  pizzas = toSignal(this.isRefresh
    .pipe(
      switchMap(() => this.pizzaService.getPizzas())
    ))

  constructor() {
    this._watchRefreshOrders();
  }

  private _watchRefreshOrders() {
    effect(() => {
      this.pizzaService.isRefreshOrders();
      this.isRefresh.next();
    })
  }

  deletePizza(id: number) {
    this.pizzaService.deletePizza(id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.pizzaService.refreshOrders();
    });
  }
}
