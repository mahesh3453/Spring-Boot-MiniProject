import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Enrollment } from '../../../core/models/enrollment.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-enrollment-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    SkeletonLoaderComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="space-y-6 pb-12">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Enrollment Audit History</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete record of student course enrollments and academic grades.
          </p>
        </div>

        <a
          routerLink="/enrollments/wizard"
          class="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 active:scale-95">
          <span>⚡</span> Launch Enrollment Wizard
        </a>
      </div>

      <!-- History Table -->
      <div class="glass-card overflow-hidden border border-slate-200 dark:border-slate-800">
        
        <div *ngIf="isLoading()" class="p-6">
          <app-skeleton-loader type="table" [count]="5"></app-skeleton-loader>
        </div>

        <div *ngIf="!isLoading() && enrollments().length === 0">
          <app-empty-state
            icon="⚡"
            title="No Enrollments Found"
            description="No active or past enrollment records registered in database."
            actionLabel="Enroll Student Now"
            (action)="goToWizard()">
          </app-empty-state>
        </div>

        <div *ngIf="!isLoading() && enrollments().length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            
            <thead class="bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-700/60">
              <tr>
                <th class="p-4">Enrollment ID</th>
                <th class="p-4">Student Name</th>
                <th class="p-4">Enrolled Course</th>
                <th class="p-4">Enrollment Date</th>
                <th class="p-4">Grade</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              <tr *ngFor="let item of enrollments()" class="hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors">
                
                <td class="p-4 font-mono font-bold text-slate-400">#ENR-{{ item.enrollmentId }}</td>

                <td class="p-4 font-bold text-slate-900 dark:text-white">
                  <a [routerLink]="['/students', item.studentId]" class="hover:text-brand-500">
                    {{ item.studentName || ('Student #' + item.studentId) }}
                  </a>
                </td>

                <td class="p-4 text-slate-700 dark:text-slate-200">
                  <a [routerLink]="['/courses', item.courseId]" class="hover:text-brand-500 font-medium">
                    {{ item.courseTitle || ('Course #' + item.courseId) }}
                  </a>
                </td>

                <td class="p-4 font-mono text-slate-500 dark:text-slate-400">
                  {{ item.enrollmentDate || '2026-07-30' }}
                </td>

                <td class="p-4">
                  <span [ngClass]="{
                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': item.grade === 'A+' || item.grade === 'A',
                    'bg-blue-500/10 text-blue-500 border-blue-500/20': item.grade === 'B' || !item.grade,
                    'bg-amber-500/10 text-amber-500 border-amber-500/20': item.grade === 'C'
                  }" class="px-2.5 py-0.5 text-[10px] font-bold rounded-full border">
                    {{ item.grade || 'A Grade' }}
                  </span>
                </td>

                <td class="p-4 text-right">
                  <button
                    (click)="confirmCancel(item)"
                    class="px-3 py-1 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-semibold text-[11px] rounded-lg transition-all border border-rose-500/20">
                    Cancel Enrollment
                  </button>
                </td>

              </tr>
            </tbody>

          </table>
        </div>

      </div>

    </div>
  `
})
export class EnrollmentHistoryComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private dialog = inject(MatDialog);

  enrollments = signal<Enrollment[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.isLoading.set(true);
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (data) => {
        this.enrollments.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.enrollments.set([]);
        this.isLoading.set(false);
      }
    });
  }

  confirmCancel(item: Enrollment): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cancel Student Enrollment',
        message: `Are you sure you want to cancel enrollment #ENR-${item.enrollmentId}? This action will disenroll the student.`,
        confirmText: 'Cancel Enrollment',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && item.enrollmentId) {
        this.enrollmentService.cancelEnrollment(item.enrollmentId).subscribe(() => {
          this.loadEnrollments();
        });
      }
    });
  }

  goToWizard(): void {}
}
