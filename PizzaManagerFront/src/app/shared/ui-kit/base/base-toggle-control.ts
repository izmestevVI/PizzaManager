import { Directive } from '@angular/core';
import { BaseControl } from './base-control';

@Directive()
export abstract class BaseToggleControl extends BaseControl<boolean> {
  
  // Переопределяем метод для работы с boolean
  toggle(): void {
    if (this.isDisabled()) return;
    const newValue = !this.value();
    this.handleValueChange(newValue);
  }

  // Удобный метод для связи с нативным (change)
  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.handleValueChange(target.checked);
  }
}