import { Component } from '@angular/core';
import { LucideAngularModule, TrendingUp } from 'lucide-angular';

@Component({
  selector: 'app-card-average-bill',
  imports: [LucideAngularModule],
  templateUrl: './card-average-bill.html',
  styleUrl: './card-average-bill.css',
})
export class CardAverageBill {
  TrendingUp = TrendingUp;
}
