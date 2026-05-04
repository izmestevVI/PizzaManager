import { Component, computed, input, output } from '@angular/core';
import { LucideAngularModule, Pen, Trash2 } from 'lucide-angular';
import { PizzaResponce } from '../../../../core/models/pizza.model';
import { RouterLink } from "@angular/router";

@Component({
  selector: '[app-menu-item]',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './menu-item.html',
  styleUrl: './menu-item.css',
})
export class MenuItem {
  readonly Pen = Pen;
  readonly Trash2 = Trash2;

  pizza = input.required<PizzaResponce>({alias: 'app-menu-item'});
  onDelete = output()
  variantPrice = computed(() => {
    const variants = this.pizza().variants;
    const priceS = variants.find(v => v.size === 'S')?.price;
    const priceM = variants.find(v => v.size === 'M')?.price;
    const priceL = variants.find(v => v.size === 'L')?.price;
    return `${priceS ? `$${priceS} ₽ | ` : '- | '} ${priceM ? `$${priceM} ₽ | ` : '- | '} ${priceL ? `$${priceL} ₽` : '-'}`;
  });
}
