import { Component } from '@angular/core';
import { BaseToggleControl } from '../base/base-toggle-control';

@Component({
  selector: 'ui-toggle',
  standalone: true,
  templateUrl: './toggle.html',
})
export class ToggleComponent extends BaseToggleControl {}
