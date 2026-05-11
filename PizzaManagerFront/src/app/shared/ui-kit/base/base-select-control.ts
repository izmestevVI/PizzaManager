import { Component, signal, input, inject, computed } from '@angular/core';
import { BaseControl } from './base-control';
import { ConnectedPosition, ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';

export interface SelectOption<T> {
  label: string;
  value: T;
  icon?: string;
  description?: string;
}

@Component({ template: '' })
export abstract class BaseSelectControl<T, O = T> extends BaseControl<T> {
  protected readonly sso = inject(ScrollStrategyOptions);
  scrollStrategy: ScrollStrategy = this.sso.reposition();
  // Список опций для выбора
  options = input.required<SelectOption<O>[]>();

  // Состояние открыт/закрыт
  isOpen = signal(false);

  // Конфигурация позиционирования: выпадать вниз (основное) или вверх (если мало места)
  readonly overlayPositions: ConnectedPosition[] = [
    {
      // Прижимаем правый край списка к правому краю триггера
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 8,
    },
    {
      // Запасной вариант (лево к левому)
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 8,
    },
    {
      // Вариант открытия вверх
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -8,
    },
  ];

  toggle(): void {
    if (this.isDisabled()) return;
    this.isOpen.update(v => !v);
    if (!this.isOpen()) {
      this.handleBlur();
    }
  }

  close(): void {
    this.isOpen.set(false);
    this.handleBlur();
  }

  abstract selectOption(option: SelectOption<O>): void;

  errorMessage = computed(() => {
    if (!this.hasError()) return null;
    return 'Пожалуйста, выберите хотя бы одно значение';
  });
}
