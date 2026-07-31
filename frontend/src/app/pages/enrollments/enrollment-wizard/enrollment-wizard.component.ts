import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../../core/services/student.service';
import { CourseService } from '../../../core/services/course.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Student } from '../../../core/models/student.model';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-enrollment-wizard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 pb-12">
      
      <!-- Wizard Header -->
      <div class="text-center">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          New Student Course Enrollment
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Complete the 4-step wizard to register a student into an academic course module.
        </p>
      </div>

      <!-- Step Indicator Bar -->
      <div class="glass-card p-4 border border-slate-200 dark:border-slate-800">
        <div class="grid grid-cols-4 gap-2 text-center text-xs">
          
          <div [class]="'flex flex-col items-center p-2 rounded-xl transition-all ' + (currentStep() === 1 ? 'bg-brand-500/10 text-brand-500 font-bold' : (currentStep() > 1 ? 'text-emerald-500' : 'text-slate-400'))">
            <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 border"
                  [class.border-brand-500]="currentStep() === 1"
                  [class.bg-emerald-500]="currentStep() > 1"
                  [class.text-white]="currentStep() > 1">
              {{ currentStep() > 1 ? '✓' : '1' }}
            </span>
            <span>1. Select Student</span>
          </div>

          <div [class]="'flex flex-col items-center p-2 rounded-xl transition-all ' + (currentStep() === 2 ? 'bg-brand-500/10 text-brand-500 font-bold' : (currentStep() > 2 ? 'text-emerald-500' : 'text-slate-400'))">
            <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 border"
                  [class.border-brand-500]="currentStep() === 2"
                  [class.bg-emerald-500]="currentStep() > 2"
                  [class.text-white]="currentStep() > 2">
              {{ currentStep() > 2 ? '✓' : '2' }}
            </span>
            <span>2. Select Course</span>
          </div>

          <div [class]="'flex flex-col items-center p-2 rounded-xl transition-all ' + (currentStep() === 3 ? 'bg-brand-500/10 text-brand-500 font-bold' : (currentStep() > 3 ? 'text-emerald-500' : 'text-slate-400'))">
            <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 border"
                  [class.border-brand-500]="currentStep() === 3"
                  [class.bg-emerald-500]="currentStep() > 3"
                  [class.text-white]="currentStep() > 3">
              {{ currentStep() > 3 ? '✓' : '3' }}
            </span>
            <span>3. Review</span>
          </div>

          <div [class]="'flex flex-col items-center p-2 rounded-xl transition-all ' + (currentStep() === 4 ? 'bg-emerald-500/10 text-emerald-500 font-bold' : 'text-slate-400')">
            <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 border"
                  [class.bg-emerald-500]="currentStep() === 4"
                  [class.text-white]="currentStep() === 4">
              4
            </span>
            <span>4. Complete</span>
          </div>

        </div>
      </div>

      <!-- STEP 1: Select Student -->
      <div *ngIf="currentStep() === 1" class="glass-card p-6 border border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <h2 class="text-base font-bold text-slate-900 dark:text-white">Step 1: Choose Student</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Select the scholar you want to enroll</p>
        </div>

        <input
          type="text"
          [(ngModel)]="studentSearch"
          placeholder="Filter students by name or email..."
          class="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        <div class="max-h-72 overflow-y-auto space-y-2 pr-1">
          <div
            *ngFor="let s of filteredStudents()"
            (click)="selectedStudent.set(s)"
            [class.border-brand-500]="selectedStudent()?.id === s.id"
            [class.bg-brand-500-10]="selectedStudent()?.id === s.id"
            class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-brand-400 transition-all">
            
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 font-bold flex items-center justify-center text-xs">
                {{ s.name.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white">{{ s.name }}</h4>
                <p class="text-[11px] text-slate-400 font-mono">{{ s.email }}</p>
              </div>
            </div>

            <div class="text-right text-xs">
              <span class="font-semibold text-slate-700 dark:text-slate-300">{{ s.city }}</span>
              <span *ngIf="selectedStudent()?.id === s.id" class="ml-3 text-brand-500 font-bold">✓ Selected</span>
            </div>

          </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            (click)="nextStep()"
            [disabled]="!selectedStudent()"
            class="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white font-semibold text-xs rounded-xl shadow-lg transition-all">
            Next: Select Course →
          </button>
        </div>
      </div>

      <!-- STEP 2: Select Course -->
      <div *ngIf="currentStep() === 2" class="glass-card p-6 border border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <h2 class="text-base font-bold text-slate-900 dark:text-white">Step 2: Choose Course Module</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Select course for {{ selectedStudent()?.name }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            *ngFor="let c of courses()"
            (click)="selectedCourse.set(c)"
            [class.border-emerald-500]="selectedCourse()?.id === c.id"
            [class.bg-emerald-500-10]="selectedCourse()?.id === c.id"
            class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-emerald-400 transition-all flex flex-col justify-between">
            
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                  {{ c.durationInWeeks }} Weeks
                </span>
                <span class="text-base font-extrabold text-slate-900 dark:text-white">₹{{ c.fee }}</span>
              </div>
              <h4 class="text-xs font-bold text-slate-900 dark:text-white mb-1">{{ c.title }}</h4>
              <p class="text-[11px] text-slate-400 line-clamp-2">{{ c.description }}</p>
            </div>

            <div *ngIf="selectedCourse()?.id === c.id" class="mt-4 pt-2 border-t border-emerald-500/20 text-right text-xs font-bold text-emerald-500">
              ✓ Selected Course
            </div>
          </div>
        </div>

        <div class="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button (click)="prevStep()" class="px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white">
            ← Back
          </button>
          <button
            (click)="nextStep()"
            [disabled]="!selectedCourse()"
            class="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white font-semibold text-xs rounded-xl shadow-lg transition-all">
            Next: Review Enrollment →
          </button>
        </div>
      </div>

      <!-- STEP 3: Review Summary -->
      <div *ngIf="currentStep() === 3" class="glass-card p-6 border border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <h2 class="text-base font-bold text-slate-900 dark:text-white">Step 3: Review Enrollment Request</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Confirm all details before submitting to Spring Boot API</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
          
          <div class="space-y-3">
            <span class="text-xs font-bold uppercase text-slate-400 block">Student Details</span>
            <div class="text-xs space-y-1">
              <p class="font-extrabold text-sm text-slate-900 dark:text-white">{{ selectedStudent()?.name }}</p>
              <p class="text-slate-400 font-mono">{{ selectedStudent()?.email }}</p>
              <p class="text-slate-500">City: {{ selectedStudent()?.city }} | ID: #{{ selectedStudent()?.id }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <span class="text-xs font-bold uppercase text-slate-400 block">Course Details</span>
            <div class="text-xs space-y-1">
              <p class="font-extrabold text-sm text-slate-900 dark:text-white">{{ selectedCourse()?.title }}</p>
              <p class="text-slate-400">Duration: {{ selectedCourse()?.durationInWeeks }} Weeks</p>
              <p class="text-emerald-500 font-extrabold text-base">₹{{ selectedCourse()?.fee }} Tuition</p>
            </div>
          </div>

        </div>

        <div class="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button (click)="prevStep()" class="px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white">
            ← Back
          </button>
          <button
            (click)="submitEnrollment()"
            [disabled]="isSubmitting()"
            class="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-xl shadow-emerald-500/25 transition-all">
            {{ isSubmitting() ? 'Processing...' : 'Confirm & Enroll Student 🎉' }}
          </button>
        </div>
      </div>

      <!-- STEP 4: Success Animation -->
      <div *ngIf="currentStep() === 4" class="glass-card p-12 text-center border border-slate-200 dark:border-slate-800 space-y-6">
        <div class="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-4xl mx-auto animate-bounce">
          ✓
        </div>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">Enrollment Successfully Confirmed!</h2>
        <p class="text-xs text-slate-400 max-w-md mx-auto">
          {{ selectedStudent()?.name }} has been officially enrolled in <strong>{{ selectedCourse()?.title }}</strong>.
        </p>

        <div class="pt-4 flex justify-center gap-4">
          <button
            (click)="resetWizard()"
            class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold rounded-xl">
            Enroll Another Student
          </button>
          <a
            routerLink="/enrollments/history"
            class="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-brand-500/25">
            View Enrollment History →
          </a>
        </div>
      </div>

    </div>
  `
})
export class EnrollmentWizardComponent implements OnInit {
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);

  currentStep = signal<number>(1);
  students = signal<Student[]>([]);
  courses = signal<Course[]>([]);
  
  selectedStudent = signal<Student | null>(null);
  selectedCourse = signal<Course | null>(null);
  isSubmitting = signal<boolean>(false);

  studentSearch = '';

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.studentService.getAllStudents().subscribe({
      next: (s) => this.students.set(s),
      error: () => this.students.set([])
    });

    this.courseService.getAllCourses().subscribe({
      next: (c) => this.courses.set(c),
      error: () => this.courses.set([])
    });
  }

  filteredStudents(): Student[] {
    if (!this.studentSearch) return this.students();
    const q = this.studentSearch.toLowerCase();
    return this.students().filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  }

  nextStep(): void {
    this.currentStep.update(s => Math.min(s + 1, 4));
  }

  prevStep(): void {
    this.currentStep.update(s => Math.max(s - 1, 1));
  }

  submitEnrollment(): void {
    const s = this.selectedStudent();
    const c = this.selectedCourse();
    if (!s?.id || !c?.id) return;

    this.isSubmitting.set(true);

    this.enrollmentService.enrollStudent({ studentId: s.id, courseId: c.id }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.currentStep.set(4);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.currentStep.set(4);
      }
    });
  }

  resetWizard(): void {
    this.selectedStudent.set(null);
    this.selectedCourse.set(null);
    this.currentStep.set(1);
  }
}
