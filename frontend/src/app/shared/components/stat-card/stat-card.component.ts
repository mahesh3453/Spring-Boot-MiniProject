import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-card p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <!-- Glow Accent Line -->
      <div [class]="'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ' + gradientClass"></div>

      <div class="flex items-center justify-between mb-4">
        <span class="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
          {{ title }}
        </span>
        <div [class]="'w-10 h-10 rounded-xl flex items-center justify-center ' + iconBgClass">
          <ng-content select="[icon]"></ng-content>
        </div>
      </div>

      <div class="flex items-baseline justify-between">
        <div class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {{ value }}
        </div>
        <div *ngIf="trend" [class]="'flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ' + (trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500')">
          <span>{{ trendUp ? '↑' : '↓' }} {{ trend }}</span>
        </div>
      </div>

      <p *ngIf="subtitle" class="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {{ subtitle }}
      </p>
    </div>
  `
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() subtitle?: string;
  @Input() trend?: string;
  @Input() trendUp: boolean = true;
  @Input() gradientClass: string = 'from-indigo-500 to-purple-500';
  @Input() iconBgClass: string = 'bg-indigo-500/10 text-indigo-500';
}
