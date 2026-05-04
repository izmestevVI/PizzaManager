import { Component, inject } from '@angular/core';
import { LucideAngularModule, TrendingDown } from 'lucide-angular';

@Component({
  selector: 'app-card-orders',
  imports: [LucideAngularModule],
  templateUrl: './card-orders.html',
  styleUrl: './card-orders.css',
})
export class CardOrders {
  TrendingDown = TrendingDown;
}
