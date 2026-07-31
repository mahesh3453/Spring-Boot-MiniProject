import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-card p-12 text-center flex flex-col items-center justify-center my-6">
      <div class="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4 text-2xl">
        {{ icon }}
      </div>
      <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">{{ title }}</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{{ description }}</p>
      <button
        *ngIf="actionLabel"
        (click)="action.emit()"
        class="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-brand-500/25 active:scale-95">
        {{ actionLabel }}
      </button>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon: string = '🔍';
  @Input() title: string = 'No Data Found';
  @Input() description: string = 'There are no records matching your request right now.';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}
