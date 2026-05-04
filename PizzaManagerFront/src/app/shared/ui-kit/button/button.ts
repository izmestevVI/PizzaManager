import { Component, computed, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'button[ui-button], a[ui-button]', // Можно использовать и как кнопку, и как ссылку
  standalone: true,
  imports: [LucideAngularModule],
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'hostClasses()',
    '[attr.disabled]': 'disabled() ? "" : null',
  }
})
export class ButtonComponent {
  // Варианты внешнего вида
  variant = input<'primary' | 'secondary' | 'outline' | 'ghost'>('primary');
  
  // Размеры
  size = input<'sm' | 'md' | 'lg'>('md');
  
  // Растягивание на всю ширину
  fullWidth = input<boolean>(false);
  
  // Состояние загрузки или блокировки
  disabled = input<boolean>(false);

  hostClasses = computed(() => {
    const base = 'inline-flex justify-center items-center gap-2 font-semibold transition-all duration-200 rounded-xl whitespace-nowrap shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-orange-500 hover:bg-orange-600 text-white',
      secondary: 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200',
      outline: 'bg-transparent border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300',
      ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-none'
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg', // Для "Фильтры" и "Добавить пиццу"
      md: 'px-5 py-2.5 text-base',        // Стандарт
      lg: 'px-6 py-3 text-lg'             // Для больших кнопок оформления
    };

    return [
      base,
      variants[this.variant()],
      sizes[this.size()],
      this.fullWidth() ? 'w-full' : 'w-auto'
    ].join(' ');
  });
}