import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { AddOrder } from '../../../add-order/add-order';
import { ButtonComponent } from '../../../../shared/ui-kit/button/button';

@Component({
  selector: 'app-widget-load-forecast',
  imports: [ButtonComponent],
  templateUrl: './widget-load-forecast.html',
  styleUrl: './widget-load-forecast.css',
})
export class WidgetLoadForecast {
  dialog = inject(Dialog);

  addOrder() {
    this.dialog.open<string>(AddOrder);
  }
}
