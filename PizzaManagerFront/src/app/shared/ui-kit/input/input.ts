import { Component, computed, input } from '@angular/core';
import { BaseControl } from '../base/base-control';
import { FormErrorComponent } from '../form-error/form-error';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [FormErrorComponent],
  templateUrl: './input.html',
})
export class InputComponent extends BaseControl<string | number> {
  // Дополнительный входной параметр для типа инпута
  type = input<'text' | 'number' | 'password' | 'tel' | 'email'>('text');
  inputClass = input<string>('ui-input-base');

  // Логика получения текста ошибки (можно расширить словарем)
  errorMessage = computed(() => {
    if (!this.hasError()) return null;
    const errors = this.ngControl?.errors;
    if (errors?.['required']) return 'Поле обязательно для заполнения';
    if (errors?.['email']) return 'Некорректный email';
    return 'Ошибка заполнения';
  });

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.handleValueChange(target.value);
  }
}
