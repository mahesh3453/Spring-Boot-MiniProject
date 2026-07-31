import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-center">
      <div class="glass-card p-12 max-w-md border border-slate-800 space-y-6">
        <div class="text-6xl font-black text-brand-500">404</div>
        <h1 class="text-xl font-bold text-white">Page Not Found</h1>
        <p class="text-xs text-slate-400">
          The academic module or route you requested does not exist or has been relocated.
        </p>
        <div>
          <a
            routerLink="/dashboard"
            class="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow-lg inline-block">
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
