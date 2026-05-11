import { inject, Injectable, signal } from '@angular/core';
import { OrderApi } from './order.api';
import { Observable } from 'rxjs';
import { CreateOrder, IOrderApi, OrderResponse } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderFacadeService {
  orderApiService = inject<IOrderApi>(OrderApi);

  private readonly _isRefreshOrders = signal<string>('');
  isRefreshOrders = this._isRefreshOrders.asReadonly();

  getOrders(): Observable<OrderResponse[]> {
    return this.orderApiService.getOrders();
  }

  addOrder(payload: CreateOrder): Observable<OrderResponse> {
    return this.orderApiService.addOrder(payload);
  }

  refreshOrders() {
    this._isRefreshOrders.set(new Date().toISOString());
  }
}
