import { Component, input } from '@angular/core';
import { OrderResponse } from '../../../../core/models/order.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: '[app-widget-latest-orders-item]',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './widget-latest-orders-item.html',
  styleUrl: './widget-latest-orders-item.css',
})
export class WidgetLatestOrdersItem {
  order = input.required<OrderResponse>({ alias: 'app-widget-latest-orders-item' });
}
