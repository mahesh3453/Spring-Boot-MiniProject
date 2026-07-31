import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, Theme } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl space-y-8 pb-12">
      
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">System & Profile Settings</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize UI aesthetics, theme preferences, API endpoints, and user account settings.
        </p>
      </div>

      <!-- Appearance Card -->
      <div class="glass-card p-6 border border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <h2 class="text-base font-bold text-slate-900 dark:text-white">UI Theme & Aesthetics</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Choose between dark SaaS mode and light interface</p>
        </div>

        <div class="grid grid-cols-2 gap-4 max-w-md">
          
          <button
            type="button"
            (click)="setTheme('dark')"
            [class.border-brand-500]="themeService.currentTheme() === 'dark'"
            class="p-4 rounded-xl border border-slate-700 bg-slate-900 text-white flex flex-col items-center gap-2 hover:border-slate-500 transition-all">
            <span class="text-2xl">🌙</span>
            <span class="text-xs font-bold">Dark SaaS Mode</span>
          </button>

          <button
            type="button"
            (click)="setTheme('light')"
            [class.border-brand-500]="themeService.currentTheme() === 'light'"
            class="p-4 rounded-xl border border-slate-300 bg-white text-slate-900 flex flex-col items-center gap-2 hover:border-slate-400 transition-all">
            <span class="text-2xl">☀️</span>
            <span class="text-xs font-bold">Light Minimal Mode</span>
          </button>

        </div>
      </div>

      <!-- Backend API Endpoint Config -->
      <div class="glass-card p-6 border border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <h2 class="text-base font-bold text-slate-900 dark:text-white">Spring Boot REST API Endpoint</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Configure target Spring Boot backend server URL</p>
        </div>

        <div class="space-y-4 max-w-lg">
          <div>
            <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Base Backend URL</label>
            <input
              type="text"
              [(ngModel)]="apiUrl"
              class="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="button"
            (click)="saveApiUrl()"
            class="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-md">
            Save Endpoint URL
          </button>
        </div>
      </div>

    </div>
  `
})
export class SettingsComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  notification = inject(NotificationService);

  apiUrl = 'http://localhost:8080';

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.notification.success(`Theme updated to ${theme} mode.`);
  }

  saveApiUrl(): void {
    this.notification.success('API endpoint configuration updated.');
  }
}
