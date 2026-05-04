import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-form-error',
  standalone: true,
  template: `
    @if (message()) {
      <p class="mt-1.5 text-xs font-medium text-error animate-in fade-in slide-in-from-top-1">
        {{ message() }}
      </p>
    }
  `
})
export class FormErrorComponent {
  message = input<string | null>(null);
}
