import { Component, computed, input } from '@angular/core';
import { BaseControl } from '../base/base-control';
import { FormErrorComponent } from '../form-error/form-error';

@Component({
  selector: 'ui-textarea',
  standalone: true,
  imports: [FormErrorComponent],
  templateUrl: './textarea.html',
})
export class TextareaComponent extends BaseControl<string> {
  rows = input<number>(3);

  errorMessage = computed(() => {
    if (!this.hasError()) return null;
    return 'Поле заполнено неверно';
  });

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.handleValueChange(target.value);
  }
}
