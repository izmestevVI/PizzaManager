import { Component, computed, input } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { LucideAngularModule, ChevronDown, Check, X } from 'lucide-angular';
import { BaseSelectControl, SelectOption } from '../base/base-select-control';
import { FormErrorComponent } from '../form-error/form-error';

@Component({
  selector: 'ui-multi-select',
  standalone: true,
  imports: [OverlayModule, LucideAngularModule, FormErrorComponent],
  templateUrl: './multi-select.html', // Используем почти такой же шаблон
})
export class MultiSelectComponent<T> extends BaseSelectControl<T[], T> {
  ChevronDown = ChevronDown;
  Check = Check;
  X = X;

  variant = input<'default' | 'inline'>('default');
  width = input<string>('100%');
  override placeholder = input<string>('Выберите...');

  // Текст для триггера
  selectedLabels = computed(() => {
    const values = this.value() || [];
    const selectedOptions = this.options().filter(opt => values.includes(opt.value));

    if (selectedOptions.length === 0) return null;
    if (selectedOptions.length <= 2) return selectedOptions.map(o => o.label).join(', ');
    return `Выбрано: ${selectedOptions.length}`;
  });

  selectOption(option: SelectOption<T>): void {
    const currentValues = this.value() || [];
    const index = currentValues.indexOf(option.value);

    let newValue: T[];
    if (index === -1) {
      newValue = [...currentValues, option.value];
    } else {
      newValue = currentValues.filter(v => v !== option.value);
    }

    this.handleValueChange(newValue);
    // Не вызываем close(), чтобы пользователь мог выбрать несколько сразу
  }

  // Удаление конкретного тега (если захотите сделать теги в будущем)
  removeValue(val: T, event: MouseEvent): void {
    event.stopPropagation();
    const newValue = (this.value() || []).filter(v => v !== val);
    this.handleValueChange(newValue);
  }

  // Классы заимствуем из вашего SelectComponent для синхронизации
  containerClass = computed(() =>
    this.variant() === 'inline'
      ? 'flex items-center gap-2 px-3 h-[34px] border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-900/50 text-sm relative'
      : 'w-full flex flex-col',
  );

  labelClass = computed(() =>
    this.variant() === 'inline'
      ? 'text-slate-500 dark:text-slate-400 whitespace-nowrap'
      : 'block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5',
  );

  triggerClass = computed(() => {
    const base = 'flex items-center justify-between gap-2 transition-all outline-none min-w-0';
    if (this.variant() === 'inline') {
      return `${base} flex-1 bg-transparent border-none text-right font-medium text-slate-900 dark:text-white`;
    }
    return `${base} ui-input-base ${this.isOpen() ? 'border-orange-500' : ''}`;
  });
}
