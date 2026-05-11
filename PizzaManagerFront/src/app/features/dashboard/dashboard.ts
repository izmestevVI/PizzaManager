import { Component } from '@angular/core';
import { DialogModule } from '@angular/cdk/dialog';
import { LucideAngularModule, TrendingUp, TrendingDown, ShoppingCart, Clock } from 'lucide-angular';
import { WidgetLayout } from './components/widget-layout/widget-layout';
import { WidgetLoadForecast } from './components/widget-load-forecast/widget-load-forecast';
import { WidgetLatestOrders } from './components/widget-latest-orders/widget-latest-orders';
import { WidgetTopPizzas } from './components/widget-top-pizzas/widget-top-pizzas';
import { WidgetSalesChart } from './components/widget-sales-chart/widget-sales-chart';
import { CardLayout } from './components/card-layout/card-layout';
import { CardRevenue } from './components/card-revenue/card-revenue';
import { CardOrders } from './components/card-orders/card-orders';
import { CardAverageBill } from './components/card-average-bill/card-average-bill';
import { CardWaiting } from './components/card-waiting/card-waiting';

@Component({
  selector: 'app-dashboard',
  imports: [
    LucideAngularModule,
    DialogModule,
    WidgetLayout,
    WidgetLoadForecast,
    WidgetLatestOrders,
    WidgetTopPizzas,
    WidgetSalesChart,
    CardLayout,
    CardRevenue,
    CardOrders,
    CardAverageBill,
    CardWaiting,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly ShoppingCart = ShoppingCart;
  readonly Clock = Clock;
}
