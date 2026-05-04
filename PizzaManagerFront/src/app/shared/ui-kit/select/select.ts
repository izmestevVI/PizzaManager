import { Component, computed, input } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { LucideAngularModule, ChevronDown, Check } from 'lucide-angular';
import { BaseSelectControl, SelectOption } from '../base/base-select-control';
import { FormErrorComponent } from "../form-error/form-error";

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [OverlayModule, LucideAngularModule, FormErrorComponent],
  templateUrl: './select.html',
})
export class SelectComponent<T> extends BaseSelectControl<T, T> {
    ChevronDown = ChevronDown;
    Check = Check;
    width = input<string>('100%');
  // Вычисляем лейбл выбранного значения
  selectedLabel = computed(() => {
    const active = this.options().find(opt => opt.value === this.value());
    return active ? active.label : null;
  });

  selectOption(option: SelectOption<T>): void {
    this.handleValueChange(option.value);
    this.close();
  }

  variant = input<'default' | 'inline'>('default');

  containerClass = computed(() => 
    this.variant() === 'inline' 
      ? 'flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-900/50 text-sm relative' 
      : 'w-full flex flex-col'
  );

  labelClass = computed(() => 
    this.variant() === 'inline'
      ? 'dark:text-slate-400 text-slate-500 whitespace-nowrap'
      : 'block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5'
  );

  triggerClass = computed(() => {
    const base = 'flex items-center justify-between gap-2 transition-all outline-none';
    const state = this.isOpen() ? 'border-orange-500' : '';
    const error = this.hasError() ? 'border-error' : '';

    if (this.variant() === 'inline') {
      // В инлайновом режиме триггер — это просто текст справа без границ
      return `${base} flex-1 bg-transparent border-none text-right font-medium text-slate-900 dark:text-white`;
    }

    // Стандартный вид инпута
    return `${base} ui-input-base ${state} ${error}`;
  });
}