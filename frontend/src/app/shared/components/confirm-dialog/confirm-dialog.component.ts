import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="p-6 max-w-md">
      <div class="flex items-center gap-4 mb-4">
        <div [ngClass]="{
          'bg-rose-500/10 text-rose-500': data.type === 'danger' || !data.type,
          'bg-amber-500/10 text-amber-500': data.type === 'warning',
          'bg-brand-500/10 text-brand-500': data.type === 'info'
        }" class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0">
          {{ data.type === 'danger' || !data.type ? '⚠️' : 'ℹ️' }}
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">{{ data.title }}</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ data.message }}</p>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button
          (click)="onCancel()"
          class="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button
          (click)="onConfirm()"
          [ngClass]="{
            'bg-rose-600 hover:bg-rose-500 shadow-rose-500/25': data.type === 'danger' || !data.type,
            'bg-amber-600 hover:bg-amber-500 shadow-amber-500/25': data.type === 'warning',
            'bg-brand-600 hover:bg-brand-500 shadow-brand-500/25': data.type === 'info'
          }"
          class="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-lg transition-all active:scale-95">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
