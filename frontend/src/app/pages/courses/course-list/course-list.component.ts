import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CourseService } from '../../../core/services/course.service';
import { Course, CourseRequest } from '../../../core/models/course.model';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    SearchBarComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="space-y-6 pb-12">
      
      <!-- Page Header & Action Button -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Academic Course Catalog</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse, manage, and publish university courses and fee structures.
          </p>
        </div>

        <button
          (click)="openCreateModal()"
          class="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 active:scale-95">
          <span>+</span> Create New Course
        </button>
      </div>

      <!-- Filters Toolbar -->
      <div class="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-800">
        <div class="w-full md:w-80">
          <app-search-bar
            placeholder="Search courses by title..."
            (search)="onSearchQuery($event)">
          </app-search-bar>
        </div>

        <!-- Fee Filter Inputs (Min & Max Fee in ₹) -->
        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div class="flex items-center gap-2">
            <span class="text-slate-600 dark:text-slate-400 font-medium">Fee (₹):</span>
            <input
              type="number"
              placeholder="Min Fee ₹"
              [(ngModel)]="minFeeFilter"
              (input)="applyFeeFilter()"
              class="w-24 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
            <span class="text-slate-400 font-bold">-</span>
            <input
              type="number"
              placeholder="Max Fee ₹"
              [(ngModel)]="maxFeeFilter"
              (input)="applyFeeFilter()"
              class="w-24 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
            <button
              *ngIf="minFeeFilter || maxFeeFilter"
              (click)="clearFeeFilter()"
              title="Reset Fee Filters"
              class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-rose-500 hover:text-white rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors">
              Reset
            </button>
          </div>

          <div class="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          <!-- Grid / List Layout Switcher -->
          <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              (click)="viewMode = 'grid'"
              [class.bg-white]="viewMode === 'grid'"
              [class.dark:bg-slate-700]="viewMode === 'grid'"
              [class.text-brand-500]="viewMode === 'grid'"
              class="p-1.5 rounded-md text-xs font-semibold text-slate-500 transition-colors">
              ⣿ Grid
            </button>
            <button
              (click)="viewMode = 'table'"
              [class.bg-white]="viewMode === 'table'"
              [class.dark:bg-slate-700]="viewMode === 'table'"
              [class.text-brand-500]="viewMode === 'table'"
              class="p-1.5 rounded-md text-xs font-semibold text-slate-500 transition-colors">
              ☰ Table
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="p-6">
        <app-skeleton-loader type="card" [count]="6"></app-skeleton-loader>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && filteredCourses().length === 0">
        <app-empty-state
          icon="📚"
          title="No Courses Found"
          description="No courses found matching your fee filter criteria or search keywords."
          actionLabel="Create Course"
          (action)="openCreateModal()">
        </app-empty-state>
      </div>

      <!-- Grid View -->
      <div *ngIf="!isLoading() && filteredCourses().length > 0 && viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let course of filteredCourses()"
          class="glass-card p-6 border border-slate-200 dark:border-slate-800 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
          
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {{ course.durationInWeeks }} Weeks Duration
              </span>
              <span class="text-lg font-black text-slate-900 dark:text-white">₹{{ course.fee }}</span>
            </div>

            <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors mb-2">
              <a [routerLink]="['/courses', course.id]">{{ course.title }}</a>
            </h3>

            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-6">
              {{ course.description || 'No detailed description provided for this course module.' }}
            </p>
          </div>

          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <a
              [routerLink]="['/courses', course.id]"
              class="text-xs font-bold text-brand-500 hover:underline">
              View Course Details →
            </a>

            <div class="flex items-center gap-1">
              <button
                (click)="openEditModal(course)"
                title="Edit Course"
                class="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                ✏️
              </button>
              <button
                (click)="confirmDelete(course)"
                title="Delete Course"
                class="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                🗑️
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Table View -->
      <div *ngIf="!isLoading() && filteredCourses().length > 0 && viewMode === 'table'" class="glass-card overflow-hidden border border-slate-200 dark:border-slate-800">
        <table class="w-full text-left text-xs border-collapse">
          <thead class="bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-700/60">
            <tr>
              <th class="p-4">ID</th>
              <th class="p-4">Course Title</th>
              <th class="p-4">Duration</th>
              <th class="p-4">Tuition Fee (₹)</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200/60 dark:divide-slate-800/60">
            <tr *ngFor="let course of filteredCourses()" class="hover:bg-slate-100/50 dark:hover:bg-slate-800/40">
              <td class="p-4 font-mono font-bold text-slate-400">#{{ course.id }}</td>
              <td class="p-4">
                <a [routerLink]="['/courses', course.id]" class="font-bold text-slate-900 dark:text-white hover:text-brand-500">
                  {{ course.title }}
                </a>
              </td>
              <td class="p-4 text-slate-600 dark:text-slate-300">{{ course.durationInWeeks }} Weeks</td>
              <td class="p-4 font-bold text-emerald-500">₹{{ course.fee }}</td>
              <td class="p-4 text-right">
                <button (click)="openEditModal(course)" class="p-1 text-slate-400 hover:text-amber-500 mr-2">✏️</button>
                <button (click)="confirmDelete(course)" class="p-1 text-slate-400 hover:text-rose-500">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add/Edit Course Modal -->
      <div *ngIf="showFormModal()" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
        <div class="glass-card p-6 w-full max-w-lg border border-slate-700 text-slate-900 dark:text-white">
          
          <div class="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <h3 class="text-lg font-bold">
              {{ isEditMode ? 'Edit Course Details' : 'Create New Course' }}
            </h3>
            <button (click)="showFormModal.set(false)" class="text-slate-400 hover:text-white text-lg">✕</button>
          </div>

          <form [formGroup]="courseForm" (ngSubmit)="saveCourse()" class="space-y-4">
            
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 mb-1">Course Title *</label>
              <input
                type="text"
                formControlName="title"
                placeholder="e.g. Master's in Artificial Intelligence"
                class="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 mb-1">Description</label>
              <textarea
                rows="3"
                formControlName="description"
                placeholder="Course curriculum highlights, outcomes, and syllabus summary..."
                class="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 mb-1">Tuition Fee (₹) *</label>
                <input
                  type="number"
                  formControlName="fee"
                  placeholder="750"
                  class="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 mb-1">Duration (Weeks) *</label>
                <input
                  type="number"
                  formControlName="durationInWeeks"
                  placeholder="12"
                  class="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                (click)="showFormModal.set(false)"
                class="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="courseForm.invalid || isSubmitting()"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50">
                {{ isSubmitting() ? 'Saving...' : (isEditMode ? 'Update Course' : 'Create Course') }}
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  `
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  courses = signal<Course[]>([]);
  isLoading = signal<boolean>(true);
  showFormModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  viewMode: 'grid' | 'table' = 'grid';
  searchQuery = '';
  minFeeFilter: number | null = null;
  maxFeeFilter: number | null = null;
  isEditMode = false;
  editingCourseId: number | null = null;

  courseForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    fee: [25000, [Validators.required, Validators.min(1)]],
    durationInWeeks: [12, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.courses.set([]);
        this.isLoading.set(false);
      }
    });
  }

  filteredCourses(): Course[] {
    let result = [...this.courses()];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q));
    }

    if (this.minFeeFilter !== null && this.minFeeFilter !== undefined && this.minFeeFilter > 0) {
      result = result.filter(c => (c.fee || 0) >= (this.minFeeFilter as number));
    }

    if (this.maxFeeFilter !== null && this.maxFeeFilter !== undefined && this.maxFeeFilter > 0) {
      result = result.filter(c => (c.fee || 0) <= (this.maxFeeFilter as number));
    }

    return result;
  }

  onSearchQuery(q: string): void {
    this.searchQuery = q;
  }

  applyFeeFilter(): void {}

  clearFeeFilter(): void {
    this.minFeeFilter = null;
    this.maxFeeFilter = null;
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingCourseId = null;
    this.courseForm.reset({
      title: '',
      description: '',
      fee: 25000,
      durationInWeeks: 12
    });
    this.showFormModal.set(true);
  }

  openEditModal(course: Course): void {
    this.isEditMode = true;
    this.editingCourseId = course.id || null;
    this.courseForm.patchValue({
      title: course.title,
      description: course.description,
      fee: course.fee,
      durationInWeeks: course.durationInWeeks
    });
    this.showFormModal.set(true);
  }

  saveCourse(): void {
    if (this.courseForm.invalid) return;

    this.isSubmitting.set(true);
    const req: CourseRequest = this.courseForm.value;

    if (this.isEditMode && this.editingCourseId) {
      this.courseService.updateCourse(this.editingCourseId, req).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.showFormModal.set(false);
          this.loadCourses();
        },
        error: () => this.isSubmitting.set(false)
      });
    } else {
      this.courseService.createCourse(req).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.showFormModal.set(false);
          this.loadCourses();
        },
        error: () => this.isSubmitting.set(false)
      });
    }
  }

  confirmDelete(course: Course): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Course Record',
        message: `Are you sure you want to delete "${course.title}"?`,
        confirmText: 'Delete Course',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && course.id) {
        this.courseService.deleteCourse(course.id).subscribe(() => {
          this.loadCourses();
        });
      }
    });
  }
}
