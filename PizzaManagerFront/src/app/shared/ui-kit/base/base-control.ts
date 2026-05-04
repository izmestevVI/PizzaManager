import { computed, Directive, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Directive({
  standalone: true
})
export abstract class BaseControl<T> implements ControlValueAccessor {
  /**
   * Инжектим NgControl для связи с [formControl] или [(ngModel)]
   * { self: true } гарантирует, что мы берем контрол именно с этого элемента
   */
  protected readonly ngControl = inject(NgControl, { self: true, optional: true });

  label = input<string>('');
  placeholder = input<string>('');
  id = input<string>(`ui-control-${Math.random().toString(36).slice(2, 9)}`);

  value = signal<T | null>(null);
  isDisabled = signal(false);
  isTouched = signal(false);

  hasError = computed(() => {
    const control = this.ngControl?.control;
    return !!(control?.invalid && (control?.touched || control?.dirty));
  });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * Методы ControlValueAccessor
   */
  writeValue(value: T): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  /**
   * Внутренние коллбэки для уведомления Angular об изменениях
   */
  protected onChange: (value: T | null) => void = () => {};
  protected onTouched: () => void = () => {};

  /**
   * Метод для вызова при изменении значения в UI
   */
  handleValueChange(newValue: T): void {
    if (this.isDisabled()) return;
    this.value.set(newValue);
    this.onChange(newValue);
  }

  /**
   * Метод для вызова при потере фокуса
   */
  handleBlur(): void {
    this.isTouched.set(true);
    this.onTouched();
  }
}