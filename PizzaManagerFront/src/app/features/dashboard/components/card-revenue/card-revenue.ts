import { Component } from '@angular/core';
import { LucideAngularModule, TrendingUp } from 'lucide-angular';

@Component({
  selector: 'app-card-revenue',
  imports: [LucideAngularModule],
  templateUrl: './card-revenue.html',
  styleUrl: './card-revenue.css',
})
export class CardRevenue {
  TrendingUp = TrendingUp;
}
