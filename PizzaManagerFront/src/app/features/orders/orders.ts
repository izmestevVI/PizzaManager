import { Component, inject } from '@angular/core';
import { LucideAngularModule, Search, Funnel, Navigation, Phone, Eye, ArrowRight, Plus } from 'lucide-angular';
import { OrderFacadeService } from '../../core/services/order.facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderItem } from "./components/order-item/order-item";
import { ButtonComponent } from "../../shared/ui-kit/button/button";
import { InputComponent } from "../../shared/ui-kit/input/input";
import { Dialog } from '@angular/cdk/dialog';
import { AddOrder } from '../add-order/add-order';

@Component({
  selector: 'app-orders',
  imports: [LucideAngularModule, OrderItem, ButtonComponent, InputComponent],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  readonly Search = Search;
  readonly Funnel = Funnel;
  readonly Navigation = Navigation;
  readonly Phone = Phone;
  readonly Eye = Eye;
  readonly ArrowRight = ArrowRight;
  readonly Plus = Plus;

  orderService = inject(OrderFacadeService);
  orders = toSignal(this.orderService.getOrders());
  dialog = inject(Dialog);

    addOrder() {
      this.dialog.open<string>(AddOrder);
    }
}
