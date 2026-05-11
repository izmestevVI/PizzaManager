import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { LucideAngularModule, Search, Menu, LayoutDashboard, ListOrdered, Moon, Sun } from 'lucide-angular';
import { ThemeService } from '../../services/theme.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InputComponent } from '../../../shared/ui-kit/input/input';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, LucideAngularModule, ScrollingModule, InputComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  readonly layoutDashboard = LayoutDashboard;
  readonly ListOrdered = ListOrdered;
  readonly Moon = Moon;
  readonly Sun = Sun;
  readonly Search = Search;
  readonly Menu = Menu;
  private readonly themeServise = inject(ThemeService);
  isDarkMode = this.themeServise.isDarkMode;

  toggleTheme() {
    this.themeServise.toggleTheme();
  }
}
