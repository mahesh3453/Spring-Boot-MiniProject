import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Student } from '../../../core/models/student.model';
import { Course } from '../../../core/models/course.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonLoaderComponent, EmptyStateComponent],
  template: `
    <div class="space-y-8 pb-12">
      
      <!-- Back Link -->
      <div>
        <a routerLink="/students" class="inline-flex items-center gap-2 text-xs font-semibold text-brand-500 hover:underline mb-2">
          ← Back to Student Directory
        </a>
      </div>

      <div *ngIf="isLoading()" class="p-8">
        <app-skeleton-loader type="card" [count]="3"></app-skeleton-loader>
      </div>

      <div *ngIf="!isLoading() && student()" class="space-y-8">
        
        <!-- Profile Header Glass Card -->
        <div class="glass-card p-6 sm:p-8 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-500"></div>

          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-400 text-white font-black text-2xl flex items-center justify-center shadow-xl shadow-brand-500/25 shrink-0">
              {{ student()?.name?.substring(0, 2)?.toUpperCase() }}
            </div>

            <div class="flex-1 text-center sm:text-left">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {{ student()?.name }}
                  </h1>
                  <p class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {{ student()?.email }}
                  </p>
                </div>
                <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 self-center sm:self-start">
                  Active Student
                </span>
              </div>

              <!-- Metadata Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span class="text-slate-400 block">Student ID</span>
                  <strong class="text-slate-900 dark:text-white font-mono">#{{ student()?.id }}</strong>
                </div>
                <div>
                  <span class="text-slate-400 block">Age</span>
                  <strong class="text-slate-900 dark:text-white">{{ student()?.age }} years</strong>
                </div>
                <div>
                  <span class="text-slate-400 block">Location</span>
                  <strong class="text-slate-900 dark:text-white">{{ student()?.city }}</strong>
                </div>
                <div>
                  <span class="text-slate-400 block">Total Enrolled</span>
                  <strong class="text-brand-500 font-bold">{{ enrolledCourses().length }} Courses</strong>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Enrolled Courses Section -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Enrolled Course Curriculum</h2>
            <button (click)="goToEnrollment()" class="text-xs font-semibold text-brand-500 hover:underline">+ Enroll in Course</button>
          </div>

          <div *ngIf="enrolledCourses().length === 0">
            <app-empty-state
              icon="📚"
              title="No Enrolled Courses"
              description="This student is not currently enrolled in any academic courses."
              actionLabel="Enroll Now"
              (action)="goToEnrollment()">
            </app-empty-state>
          </div>

          <div *ngIf="enrolledCourses().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              *ngFor="let course of enrolledCourses()"
              class="glass-card p-6 border border-slate-200 dark:border-slate-800 hover:-translate-y-1 transition-all duration-300">
              <div class="flex items-center justify-between mb-3">
                <span class="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-500/10 text-brand-500">
                  {{ course.durationInWeeks }} Weeks
                </span>
                <span class="text-xs font-extrabold text-slate-900 dark:text-white">₹{{ course.fee }}</span>
              </div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-2">{{ course.title }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{{ course.description }}</p>
              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-400">
                <span>Status: In Progress</span>
                <span class="text-emerald-500 font-bold">Grade A</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class StudentProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private enrollmentService = inject(EnrollmentService);

  student = signal<Student | null>(null);
  enrolledCourses = signal<Course[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadStudentProfile(id);
    }
  }

  private loadStudentProfile(id: number): void {
    this.isLoading.set(true);

    this.studentService.getStudentById(id).subscribe({
      next: (data) => {
        this.student.set(data);
        this.loadEnrolledCourses(id);
      },
      error: () => {
        this.student.set(null);
        this.enrolledCourses.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadEnrolledCourses(studentId: number): void {
    this.enrollmentService.getCoursesByStudentId(studentId).subscribe({
      next: (courses) => {
        this.enrolledCourses.set(courses);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  goToEnrollment(): void {
    this.router.navigate(['/enrollments/wizard']);
  }
}
