import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateOrder, IOrderApi, OrderResponse } from '../models/order.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderApi implements IOrderApi {
  private apiUrl = '/api/orders';
  private readonly _httpClient = inject(HttpClient);

  getOrders(): Observable<OrderResponse[]> {
    return this._httpClient.get<OrderResponse[]>(this.apiUrl);
  }

  addOrder(payload: CreateOrder): Observable<OrderResponse> {
    return this._httpClient.post<OrderResponse>(this.apiUrl, payload);
  }
}
