import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Course } from '../../../core/models/course.model';
import { Student } from '../../../core/models/student.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonLoaderComponent, EmptyStateComponent],
  template: `
    <div class="space-y-8 pb-12">
      
      <!-- Back Navigation -->
      <div>
        <a routerLink="/courses" class="inline-flex items-center gap-2 text-xs font-semibold text-emerald-500 hover:underline mb-2">
          ← Back to Course Catalog
        </a>
      </div>

      <div *ngIf="isLoading()" class="p-8">
        <app-skeleton-loader type="card" [count]="3"></app-skeleton-loader>
      </div>

      <div *ngIf="!isLoading() && course()" class="space-y-8">
        
        <!-- Course Header Card -->
        <div class="glass-card p-8 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500"></div>

          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-2 max-w-2xl">
              <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {{ course()?.durationInWeeks }} Weeks Curriculum
              </span>
              <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {{ course()?.title }}
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ course()?.description }}
              </p>
            </div>

            <div class="p-6 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center shrink-0">
              <span class="text-xs uppercase font-semibold text-slate-400 block mb-1">Standard Fee</span>
              <span class="text-3xl font-black text-emerald-500">₹{{ course()?.fee }}</span>
              <span class="text-[10px] text-slate-400 block mt-1">Per Enrolled Student</span>
            </div>
          </div>
        </div>

        <!-- Enrolled Students Section -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Enrolled Roster</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Students actively taking this course</p>
            </div>
            <button (click)="goToEnrollment()" class="text-xs font-semibold text-brand-500 hover:underline">
              + Enroll a Student
            </button>
          </div>

          <div *ngIf="enrolledStudents().length === 0">
            <app-empty-state
              icon="🎓"
              title="No Enrolled Students"
              description="No students are currently enrolled in this course."
              actionLabel="Enroll a Student"
              (action)="goToEnrollment()">
            </app-empty-state>
          </div>

          <div *ngIf="enrolledStudents().length > 0" class="glass-card overflow-hidden border border-slate-200 dark:border-slate-800">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-700/60">
                <tr>
                  <th class="p-4">Student ID</th>
                  <th class="p-4">Name</th>
                  <th class="p-4">Email</th>
                  <th class="p-4">City</th>
                  <th class="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                <tr *ngFor="let student of enrolledStudents()" class="hover:bg-slate-100/50 dark:hover:bg-slate-800/40">
                  <td class="p-4 font-mono font-bold text-slate-400">#{{ student.id }}</td>
                  <td class="p-4 font-bold text-slate-900 dark:text-white">{{ student.name }}</td>
                  <td class="p-4 font-mono text-slate-500 dark:text-slate-400">{{ student.email }}</td>
                  <td class="p-4 text-slate-600 dark:text-slate-300">{{ student.city }}</td>
                  <td class="p-4 text-right">
                    <a [routerLink]="['/students', student.id]" class="text-xs font-bold text-brand-500 hover:underline">
                      View Profile →
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  `
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);

  course = signal<Course | null>(null);
  enrolledStudents = signal<Student[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCourseDetail(id);
    }
  }

  private loadCourseDetail(id: number): void {
    this.isLoading.set(true);

    this.courseService.getCourseById(id).subscribe({
      next: (data) => {
        this.course.set(data);
        this.loadEnrolledStudents(id);
      },
      error: () => {
        this.course.set(null);
        this.enrolledStudents.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadEnrolledStudents(courseId: number): void {
    this.enrollmentService.getStudentsByCourseId(courseId).subscribe({
      next: (students) => {
        this.enrolledStudents.set(students);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  goToEnrollment(): void {
    this.router.navigate(['/enrollments/wizard']);
  }
}
