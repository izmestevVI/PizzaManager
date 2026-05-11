import { Component, input } from '@angular/core';
import { ArrowRight, Eye, LucideAngularModule, Phone, Navigation } from 'lucide-angular';
import { OrderResponse } from '../../../../core/models/order.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: '[app-order-item]',
  imports: [LucideAngularModule, CurrencyPipe, DatePipe],
  templateUrl: './order-item.html',
  styleUrl: './order-item.css',
})
export class OrderItem {
  Navigation = Navigation;
  ArrowRight = ArrowRight;
  Eye = Eye;
  Phone = Phone;

  order = input.required<OrderResponse>({ alias: 'app-order-item' });
}
