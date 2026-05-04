import { Component, input } from '@angular/core';

@Component({
  selector: 'app-widget-layout',
  imports: [],
  templateUrl: './widget-layout.html',
  styleUrl: './widget-layout.css',
})
export class WidgetLayout {
  title = input.required<string>();
}
