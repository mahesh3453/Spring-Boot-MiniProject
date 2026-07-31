import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="type === 'table'" class="space-y-4">
      <div *ngFor="let i of rowsArray" class="h-12 bg-slate-200 dark:bg-slate-800/60 rounded-xl skeleton-shimmer w-full"></div>
    </div>

    <div *ngIf="type === 'card'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div *ngFor="let i of cardsArray" class="h-44 bg-slate-200 dark:bg-slate-800/60 rounded-2xl skeleton-shimmer"></div>
    </div>
  `
})
export class SkeletonLoaderComponent {
  @Input() type: 'table' | 'card' = 'table';
  @Input() count: number = 5;

  get rowsArray(): number[] {
    return Array(this.count).fill(0);
  }

  get cardsArray(): number[] {
    return Array(this.count).fill(0);
  }
}
