import { Component, effect, inject, signal } from '@angular/core';
import { OrderFacadeService } from '../../../../core/services/order.facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { WidgetLatestOrdersItem } from "../widget-latest-orders-item/widget-latest-orders-item";
import { OrderResponse } from '../../../../core/models/order.model';
import { map, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-widget-latest-orders',
  imports: [WidgetLatestOrdersItem],
  templateUrl: './widget-latest-orders.html',
  styleUrl: './widget-latest-orders.css',
})
export class WidgetLatestOrders {
  orderFacadeService = inject(OrderFacadeService);
  isRefresh = new Subject<void>();
  orders = toSignal(this.isRefresh
    .pipe(
      switchMap(() => this.orderFacadeService.getOrders()),
      map(orders => orders.slice(0, 2))
    ))

  constructor() {
    this._watchRefreshOrders();
  }

  private _watchRefreshOrders() {
    effect(() => {
      this.orderFacadeService.isRefreshOrders();
      this.isRefresh.next();
    })
  }
}
