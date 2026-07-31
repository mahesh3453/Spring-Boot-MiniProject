import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        type="text"
        [(ngModel)]="query"
        (ngModelChange)="onQueryChange($event)"
        [placeholder]="placeholder"
        class="w-full pl-10 pr-9 py-2 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
      />

      <button
        *ngIf="query"
        (click)="clear()"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        ✕
      </button>
    </div>
  `
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Search records...';
  @Input() query: string = '';
  @Output() search = new EventEmitter<string>();

  onQueryChange(val: string): void {
    this.search.emit(val);
  }

  clear(): void {
    this.query = '';
    this.search.emit('');
  }
}
