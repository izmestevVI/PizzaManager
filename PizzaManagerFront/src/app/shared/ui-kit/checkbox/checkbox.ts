import { Component } from '@angular/core';
import { BaseToggleControl } from '../base/base-toggle-control';
import { LucideAngularModule, Check } from 'lucide-angular';

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './checkbox.html',
})
export class CheckboxComponent extends BaseToggleControl {
  Check = Check;
}
