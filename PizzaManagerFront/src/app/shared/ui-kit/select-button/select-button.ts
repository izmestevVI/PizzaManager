import { Component, computed, input } from '@angular/core';
import { BaseControl } from '../base/base-control';
import { SelectButtonOption } from './select-button.model';

@Component({
  selector: 'ui-select-button',
  standalone: true,
  templateUrl: './select-button.html',
})
export class SelectButtonComponent<T> extends BaseControl<T> {
  // Список опций для отображения
  options = input.required<SelectButtonOption<T>[]>();
  variant = input<'default' | 'inline'>('default');

  containerClass = computed(() =>
    this.variant() === 'inline'
      ? // Добавляем h-[34px] для жесткой фиксации, если паддинги подведут
        'flex items-center h-[34px] border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-900/50 relative transition-colors'
      : 'flex flex-col gap-1.5',
  );

  labelClass = computed(() =>
    this.variant() === 'inline'
      ? // В макете шрифт лейбла совпадает с кнопками, но он серый
        'text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap'
      : 'text-sm font-semibold text-slate-700 dark:text-slate-300',
  );

  groupClass = computed(() =>
    this.variant() === 'inline'
      ? // p-1 (4px) зазоры сверху и снизу
        'flex gap-0.5 ml-auto p-1'
      : 'inline-flex p-1 bg-gray-100 dark:bg-slate-900 rounded-xl w-fit',
  );

  buttonClass(optValue: T): string {
    const isActive = this.value() === optValue;

    if (this.variant() === 'inline') {
      // Ключевое изменение: border-transparent для неактивных кнопок
      // Это резервирует место под рамку, чтобы высота не прыгала.
      const baseInline = 'px-3 py-1 text-xs md:text-sm font-medium rounded-md transition-all whitespace-nowrap outline-none border';

      return isActive
        ? `${baseInline} bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border-gray-100 dark:border-slate-700`
        : `${baseInline} border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200`;
    }

    // Default вариант (оставляем как был)
    const baseDefault = 'px-4 py-2 text-sm font-bold rounded-lg transition-all uppercase';
    return isActive
      ? `${baseDefault} bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-black/5 dark:ring-white/5`
      : `${baseDefault} text-slate-500 hover:text-slate-700 dark:hover:text-slate-300`;
  }

  select(val: T): void {
    if (this.isDisabled()) return;
    this.handleValueChange(val);
  }
}
