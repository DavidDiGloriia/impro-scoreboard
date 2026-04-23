import {Component, ElementRef, forwardRef, HostListener, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [FormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchableSelectComponent),
    multi: true,
  }],
  templateUrl: './searchable-select.component.html',
  styleUrl: './searchable-select.component.scss',
})
export class SearchableSelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder = '';
  @Input() size: 'sm' | 'md' = 'md';

  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

  searchText = '';
  isOpen = false;
  highlightedIndex = -1;
  selectedValue = '';

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  get filteredOptions(): SelectOption[] {
    if (!this.searchText) return this.options;
    const q = this.searchText.toLowerCase();
    return this.options.filter(o => o.label.toLowerCase().includes(q));
  }

  get displayText(): string {
    if (this.isOpen) return this.searchText;
    const found = this.options.find(o => o.value === this.selectedValue);
    return found?.label || '';
  }

  writeValue(value: string): void {
    this.selectedValue = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  onFocus(): void {
    this.searchText = '';
    this.isOpen = true;
    this.highlightedIndex = -1;
  }

  onInput(text: string): void {
    this.searchText = text;
    this.isOpen = true;
    this.highlightedIndex = 0;
  }

  select(option: SelectOption): void {
    this.selectedValue = option.value;
    this.searchText = '';
    this.isOpen = false;
    this._onChange(option.value);
    this._onTouched();
  }

  selectEmpty(): void {
    this.selectedValue = '';
    this.searchText = '';
    this.isOpen = false;
    this._onChange('');
    this._onTouched();
  }

  onBlur(): void {
    // Delay to allow click on option to register
    setTimeout(() => {
      this.isOpen = false;
      this.searchText = '';
    }, 200);
    this._onTouched();
  }

  onKeydown(event: KeyboardEvent): void {
    const filtered = this.filteredOptions;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedIndex = Math.min(this.highlightedIndex + 1, filtered.length - 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.highlightedIndex >= 0 && this.highlightedIndex < filtered.length) {
        this.select(filtered[this.highlightedIndex]);
      }
    } else if (event.key === 'Escape') {
      this.isOpen = false;
      this.searchText = '';
      this.searchInput?.nativeElement?.blur();
    }
  }
}
