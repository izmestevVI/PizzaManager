import { Component, computed, signal, ElementRef, viewChild } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { LucideAngularModule, ChevronDown, Search, X, Check } from 'lucide-angular';
import { BaseSelectControl, SelectOption } from '../base/base-select-control';
import { FormErrorComponent } from '../form-error/form-error';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ui-autocomplete',
  standalone: true,
  imports: [OverlayModule, LucideAngularModule, FormErrorComponent, FormsModule],
  templateUrl: './autocomplete.html',
})
export class AutocompleteComponent<T> extends BaseSelectControl<T, T> {
  Search = Search;
  ChevronDown = ChevronDown;
  X = X;
  Check = Check;
  private queryChange$ = new Subject<string>();

  searchQuery = signal('');

  inputElement = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  constructor() {
    super();

    this.queryChange$.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed()).subscribe(query => {
      this.searchQuery.set(query);
    });
  }

  filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.options();
    return this.options().filter(opt => opt.label.toLowerCase().includes(query));
  });

  selectedLabel = computed(() => {
    const active = this.options().find(opt => opt.value === this.value());
    return active ? active.label : '';
  });

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (!this.isOpen()) this.isOpen.set(true);
    this.queryChange$.next(value);
  }

  selectOption(option: SelectOption<T>): void {
    this.handleValueChange(option.value);
    this.searchQuery.set('');
    this.close();
  }

  override toggle(): void {
    if (this.isDisabled()) return;
    super.toggle();
    if (this.isOpen()) {
      setTimeout(() => this.inputElement()?.nativeElement.focus(), 0);
    }
  }

  clear(): void {
    this.handleValueChange(null);
    this.searchQuery.set('');
    this.inputElement()?.nativeElement.focus();
  }

  containerClass = computed(() => 'w-full flex flex-col');
}
