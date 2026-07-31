import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { StudentService } from '../../../core/services/student.service';
import { Student, StudentRequest } from '../../../core/models/student.model';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-student-list',
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
      
      <!-- Page Header & Action Controls -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Student Directory</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage student registrations, academic records, and profiles.
          </p>
        </div>

        <button
          (click)="openCreateModal()"
          class="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 active:scale-95">
          <span>+</span> Register New Student
        </button>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-800">
        <div class="w-full md:w-80">
          <app-search-bar
            placeholder="Search by name, email, or city..."
            (search)="onSearchQuery($event)">
          </app-search-bar>
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto justify-end text-xs">
          <select
            [(ngModel)]="selectedCityFilter"
            (change)="applyCityFilter()"
            class="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none">
            <option value="">All Cities</option>
            <option *ngFor="let city of uniqueCities()" [value]="city">{{ city }}</option>
          </select>

          <span class="text-slate-400">Total: <strong class="text-slate-900 dark:text-white">{{ filteredStudents().length }}</strong></span>
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="glass-card overflow-hidden border border-slate-200 dark:border-slate-800 relative">
        
        <div *ngIf="isLoading()" class="p-6">
          <app-skeleton-loader type="table" [count]="6"></app-skeleton-loader>
        </div>

        <div *ngIf="!isLoading() && filteredStudents().length === 0">
          <app-empty-state
            icon="🎓"
            title="No Students Found"
            description="No student records match your current filter criteria."
            actionLabel="Register Student"
            (action)="openCreateModal()">
          </app-empty-state>
        </div>

        <div *ngIf="!isLoading() && filteredStudents().length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            
            <thead class="bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-700/60 sticky top-0 backdrop-blur-md">
              <tr>
                <th (click)="sort('id')" class="p-4 cursor-pointer hover:text-brand-500 transition-colors">ID ↕</th>
                <th (click)="sort('name')" class="p-4 cursor-pointer hover:text-brand-500 transition-colors">Student Name ↕</th>
                <th (click)="sort('email')" class="p-4 cursor-pointer hover:text-brand-500 transition-colors">Email Address ↕</th>
                <th (click)="sort('age')" class="p-4 cursor-pointer hover:text-brand-500 transition-colors">Age ↕</th>
                <th (click)="sort('city')" class="p-4 cursor-pointer hover:text-brand-500 transition-colors">City ↕</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              <tr
                *ngFor="let student of pagedStudents()"
                class="hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors group">
                
                <td class="p-4 font-mono font-bold text-slate-400">#{{ student.id }}</td>
                
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 font-bold flex items-center justify-center text-xs shrink-0">
                      {{ student.name.substring(0, 2).toUpperCase() }}
                    </div>
                    <div>
                      <a [routerLink]="['/students', student.id]" class="font-bold text-slate-900 dark:text-white hover:text-brand-500 transition-colors">
                        {{ student.name }}
                      </a>
                    </div>
                  </div>
                </td>

                <td class="p-4 text-slate-600 dark:text-slate-300 font-mono">{{ student.email }}</td>
                <td class="p-4 text-slate-700 dark:text-slate-300">{{ student.age }} yrs</td>
                
                <td class="p-4">
                  <span class="px-2.5 py-1 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    {{ student.city }}
                  </span>
                </td>

                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <a
                      [routerLink]="['/students', student.id]"
                      title="View Details"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      👁️
                    </a>
                    <button
                      (click)="openEditModal(student)"
                      title="Edit Record"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      ✏️
                    </button>
                    <button
                      (click)="confirmDelete(student)"
                      title="Delete Record"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>

          </table>
        </div>

        <!-- Pagination Controls Footer -->
        <div *ngIf="filteredStudents().length > 0" class="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong>{{ (currentPage - 1) * pageSize + 1 }}</strong> to <strong>{{ Math.min(currentPage * pageSize, filteredStudents().length) }}</strong> of <strong>{{ filteredStudents().length }}</strong>
          </div>

          <div class="flex items-center gap-2">
            <button
              (click)="changePage(currentPage - 1)"
              [disabled]="currentPage === 1"
              class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              Previous
            </button>
            <span class="font-bold text-slate-900 dark:text-white px-2">Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              (click)="changePage(currentPage + 1)"
              [disabled]="currentPage >= totalPages"
              class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              Next
            </button>
          </div>
        </div>

      </div>

      <!-- Add/Edit Student Form Modal -->
      <div *ngIf="showFormModal()" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
        <div class="glass-card p-6 w-full max-w-lg border border-slate-700 text-slate-900 dark:text-white">
          
          <div class="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <h3 class="text-lg font-bold">
              {{ isEditMode ? 'Edit Student Record' : 'Register New Student' }}
            </h3>
            <button (click)="showFormModal.set(false)" class="text-slate-400 hover:text-white text-lg">✕</button>
          </div>

          <form [formGroup]="studentForm" (ngSubmit)="saveStudent()" class="space-y-4">
            
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 mb-1">Full Name *</label>
              <input
                type="text"
                formControlName="name"
                placeholder="e.g. Eleanor Vance"
                class="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p *ngIf="studentForm.get('name')?.touched && studentForm.get('name')?.invalid" class="text-[10px] text-rose-400 mt-1">Name is required.</p>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 mb-1">Email Address *</label>
              <input
                type="email"
                formControlName="email"
                placeholder="eleanor@university.edu"
                class="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p *ngIf="studentForm.get('email')?.touched && studentForm.get('email')?.invalid" class="text-[10px] text-rose-400 mt-1">Valid email required.</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 mb-1">Age *</label>
                <input
                  type="number"
                  formControlName="age"
                  placeholder="21"
                  class="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 mb-1">City *</label>
                <input
                  type="text"
                  formControlName="city"
                  placeholder="e.g. Hyderabad"
                  class="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 mb-1">Account Password *</label>
              <input
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
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
                [disabled]="studentForm.invalid || isSubmitting()"
                class="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50">
                {{ isSubmitting() ? 'Saving...' : (isEditMode ? 'Update Student' : 'Create Student') }}
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  `
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  Math = Math;

  students = signal<Student[]>([]);
  isLoading = signal<boolean>(true);
  showFormModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  searchQuery = '';
  selectedCityFilter = '';
  sortColumn = 'id';
  sortAsc = true;
  currentPage = 1;
  pageSize = 8;
  isEditMode = false;
  editingStudentId: number | null = null;

  studentForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    age: [20, [Validators.required, Validators.min(16), Validators.max(100)]],
    city: ['', Validators.required],
    password: ['pass123', Validators.required]
  });

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading.set(true);
    this.studentService.getAllStudents().subscribe({
      next: (data: Student[]) => {
        this.students.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.students.set([]);
        this.isLoading.set(false);
      }
    });
  }

  uniqueCities(): string[] {
    return Array.from(new Set(this.students().map(s => s.city).filter(Boolean)));
  }

  filteredStudents(): Student[] {
    let result = [...this.students()];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
      );
    }

    if (this.selectedCityFilter) {
      result = result.filter(s => s.city === this.selectedCityFilter);
    }

    result.sort((a: any, b: any) => {
      const valA = a[this.sortColumn];
      const valB = b[this.sortColumn];
      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }

  pagedStudents(): Student[] {
    const list = this.filteredStudents();
    const start = (this.currentPage - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStudents().length / this.pageSize) || 1;
  }

  onSearchQuery(q: string): void {
    this.searchQuery = q;
    this.currentPage = 1;
  }

  applyCityFilter(): void {
    this.currentPage = 1;
  }

  sort(col: string): void {
    if (this.sortColumn === col) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = col;
      this.sortAsc = true;
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingStudentId = null;
    this.studentForm.reset({
      name: '',
      email: '',
      age: 21,
      city: 'Hyderabad',
      password: 'password123'
    });
    this.showFormModal.set(true);
  }

  openEditModal(student: Student): void {
    this.isEditMode = true;
    this.editingStudentId = student.id || null;
    this.studentForm.patchValue({
      name: student.name,
      email: student.email,
      age: student.age,
      city: student.city,
      password: 'password123'
    });
    this.showFormModal.set(true);
  }

  saveStudent(): void {
    if (this.studentForm.invalid) return;

    this.isSubmitting.set(true);
    const req: StudentRequest = this.studentForm.value;

    if (this.isEditMode && this.editingStudentId) {
      this.studentService.updateStudent(this.editingStudentId, req).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.showFormModal.set(false);
          this.loadStudents();
        },
        error: () => this.isSubmitting.set(false)
      });
    } else {
      this.studentService.createStudent(req).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.showFormModal.set(false);
          this.loadStudents();
        },
        error: () => this.isSubmitting.set(false)
      });
    }
  }

  confirmDelete(student: Student): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Student Record',
        message: `Are you sure you want to delete ${student.name}? All associated enrollments will be permanently removed.`,
        confirmText: 'Delete Student',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && student.id) {
        this.studentService.deleteStudent(student.id).subscribe(() => {
          this.loadStudents();
        });
      }
    });
  }
}
