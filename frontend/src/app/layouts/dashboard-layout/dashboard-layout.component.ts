import { Component, signal, inject, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../core/services/loading.service';
import { StudentService } from '../../core/services/student.service';
import { CourseService } from '../../core/services/course.service';
import { Student } from '../../core/models/student.model';
import { Course } from '../../core/models/course.model';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: string;
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      <!-- Top Loading Bar Indicator -->
      <div *ngIf="loadingService.isLoading()" class="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50 animate-pulse"></div>

      <div class="flex flex-1 overflow-hidden">
        
        <!-- Sidebar -->
        <aside
          [class.w-64]="isExpanded()"
          [class.w-20]="!isExpanded()"
          class="hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl transition-all duration-300 relative z-30 shrink-0">
          
          <!-- Logo Header -->
          <div class="h-16 flex items-center px-4 justify-between border-b border-slate-200/60 dark:border-slate-800/60">
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-brand-500/30 shrink-0">
                E
              </div>
              <div *ngIf="isExpanded()" class="flex flex-col">
                <span class="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">EduTrack Pro</span>
                <span class="text-[10px] text-brand-500 font-semibold tracking-wider uppercase">Enterprise</span>
              </div>
            </div>

            <button
              (click)="toggleSidebar()"
              class="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 flex items-center justify-center text-xs transition-colors">
              {{ isExpanded() ? '◀' : '▶' }}
            </button>
          </div>

          <!-- Navigation Links -->
          <nav class="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
            <a
              *ngFor="let item of navItems"
              [routerLink]="item.route"
              routerLinkActive="bg-brand-600 text-white shadow-lg shadow-brand-600/25 font-semibold"
              [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all group">
              <span class="text-base group-hover:scale-110 transition-transform">{{ item.icon }}</span>
              <span *ngIf="isExpanded()" class="truncate">{{ item.label }}</span>
              <span *ngIf="isExpanded() && item.badge" class="ml-auto text-[10px] bg-brand-500/10 text-brand-500 font-bold px-2 py-0.5 rounded-full">
                {{ item.badge }}
              </span>
            </a>
          </nav>

          <!-- System Status Footer -->
          <div class="p-3 border-t border-slate-200/60 dark:border-slate-800/60">
            <div [class.justify-center]="!isExpanded()" class="flex items-center gap-3 p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/40">
              <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div *ngIf="isExpanded()" class="flex flex-col text-[11px]">
                <span class="font-bold text-slate-800 dark:text-slate-200">API Connected</span>
                <span class="text-slate-400">Spring Boot :8080</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          <!-- Top Navbar -->
          <header class="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 z-20">
            
            <!-- Breadcrumbs / Mobile Drawer Toggle -->
            <div class="flex items-center gap-4">
              <button
                (click)="toggleSidebar()"
                class="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                ☰
              </button>
              
              <div class="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span class="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">System</span>
                <span>/</span>
                <span class="text-slate-900 dark:text-white font-bold capitalize">{{ currentRouteTitle }}</span>
              </div>
            </div>

            <!-- Header Right Controls -->
            <div class="flex items-center gap-3 sm:gap-5">
              
              <!-- Quick Search Button -->
              <button
                (click)="openQuickSearch()"
                class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-400 hover:border-brand-500 transition-all">
                <span>🔍</span>
                <span>Quick search...</span>
                <kbd class="px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded font-mono">⌘K</kbd>
              </button>

              <!-- Notifications Toggle -->
              <div class="relative">
                <button
                  (click)="toggleNotifications()"
                  class="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  🔔
                  <span *ngIf="unreadCount > 0" class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500"></span>
                </button>

                <!-- Notifications Dropdown Popover -->
                <div
                  *ngIf="showNotifications()"
                  class="absolute right-0 mt-2 w-80 glass-card p-4 shadow-2xl z-50 text-xs border border-slate-200 dark:border-slate-800 animate-fade-in">
                  <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <h4 class="font-bold text-slate-900 dark:text-white">Notifications ({{ unreadCount }})</h4>
                    <button (click)="markAllAsRead()" class="text-[10px] font-semibold text-brand-500 hover:underline">
                      Mark all as read
                    </button>
                  </div>

                  <div class="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    <div
                      *ngFor="let item of notifications"
                      [ngClass]="{
                        'bg-slate-100/60 dark:bg-slate-800/40': !item.read
                      }"
                      class="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-start gap-2.5">
                      <span class="text-sm">
                        {{ item.type === 'success' ? '✅' : (item.type === 'warning' ? '⚠️' : 'ℹ️') }}
                      </span>
                      <div class="flex-1">
                        <p class="font-bold text-slate-900 dark:text-white text-[11px]">{{ item.title }}</p>
                        <p class="text-[10px] text-slate-400 mt-0.5 leading-tight">{{ item.message }}</p>
                        <span class="text-[9px] text-slate-400 block mt-1">{{ item.time }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Dark / Light Theme Toggle -->
              <button
                (click)="themeService.toggleTheme()"
                title="Toggle Light / Dark Mode"
                class="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-base transition-colors">
                {{ themeService.currentTheme() === 'dark' ? '☀️' : '🌙' }}
              </button>

              <div class="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>

              <!-- User Profile Avatar -->
              <div class="relative">
                <button
                  (click)="toggleUserMenu()"
                  class="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <img
                    [src]="authService.currentUser()?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'"
                    alt="Profile Avatar"
                    class="w-8 h-8 rounded-xl object-cover ring-2 ring-brand-500/30"
                  />
                  <div class="hidden sm:flex flex-col text-left text-xs">
                    <span class="font-bold text-slate-900 dark:text-white leading-none">
                      {{ authService.currentUser()?.name }}
                    </span>
                    <span class="text-[10px] text-slate-400 leading-tight">
                      {{ authService.currentUser()?.role }}
                    </span>
                  </div>
                </button>

                <!-- Profile Dropdown Menu -->
                <div
                  *ngIf="showUserMenu()"
                  class="absolute right-0 mt-2 w-48 glass-card p-1.5 shadow-2xl z-50 text-xs border border-slate-200 dark:border-slate-800">
                  <div class="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p class="font-bold text-slate-900 dark:text-white truncate">{{ authService.currentUser()?.name }}</p>
                    <p class="text-[10px] text-slate-400 truncate">{{ authService.currentUser()?.email }}</p>
                  </div>
                  <a routerLink="/settings" (click)="showUserMenu.set(false)" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                    ⚙️ Settings & Profile
                  </a>
                  <button (click)="authService.logout()" class="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-500 font-semibold mt-1">
                    🚪 Sign Out
                  </button>
                </div>
              </div>

            </div>
          </header>

          <!-- Main Scrollable Body -->
          <main class="flex-1 overflow-y-auto p-4 sm:p-8">
            <router-outlet></router-outlet>
          </main>

        </div>

      </div>

      <!-- Quick Search Modal Overlay -->
      <div *ngIf="showSearchModal()" class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 p-4 z-50 animate-fade-in">
        <div class="glass-card p-6 w-full max-w-lg border border-slate-700 text-slate-900 dark:text-white shadow-2xl">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
            <h3 class="text-sm font-bold flex items-center gap-2">🔍 Instant System Search</h3>
            <button (click)="showSearchModal.set(false)" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchInput($event)"
            placeholder="Type student name, email, or course title..."
            class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 mb-4"
          />

          <!-- Search Results Stream -->
          <div class="space-y-4 max-h-80 overflow-y-auto pr-1">
            
            <!-- Matching Students -->
            <div *ngIf="matchingStudents.length > 0">
              <span class="text-[10px] font-bold uppercase text-brand-500 block mb-1">Students ({{ matchingStudents.length }})</span>
              <div *ngFor="let s of matchingStudents" (click)="navigateToStudent(s.id!)" class="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center text-xs">
                <div>
                  <p class="font-bold text-slate-900 dark:text-white">{{ s.name }}</p>
                  <p class="text-[10px] text-slate-400 font-mono">{{ s.email }}</p>
                </div>
                <span class="text-[10px] text-slate-500">{{ s.city }}</span>
              </div>
            </div>

            <!-- Matching Courses -->
            <div *ngIf="matchingCourses.length > 0">
              <span class="text-[10px] font-bold uppercase text-emerald-500 block mb-1">Courses ({{ matchingCourses.length }})</span>
              <div *ngFor="let c of matchingCourses" (click)="navigateToCourse(c.id!)" class="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center text-xs">
                <div>
                  <p class="font-bold text-slate-900 dark:text-white">{{ c.title }}</p>
                  <p class="text-[10px] text-slate-400">{{ c.durationInWeeks }} Weeks</p>
                </div>
                <span class="font-bold text-emerald-500">₹{{ c.fee }}</span>
              </div>
            </div>

            <div *ngIf="searchQuery && matchingStudents.length === 0 && matchingCourses.length === 0" class="text-center py-6 text-xs text-slate-400">
              No matching records found.
            </div>

          </div>
        </div>
      </div>

    </div>
  `
})
export class DashboardLayoutComponent implements OnInit {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  loadingService = inject(LoadingService);
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private router = inject(Router);

  isExpanded = signal<boolean>(true);
  showUserMenu = signal<boolean>(false);
  showNotifications = signal<boolean>(false);
  showSearchModal = signal<boolean>(false);

  searchQuery = '';
  matchingStudents: Student[] = [];
  matchingCourses: Course[] = [];

  notifications: NotificationItem[] = [
    { id: 1, title: 'Spring Boot REST API Connected', message: 'Backend running live on port 8080.', time: 'Just now', read: false, type: 'success' },
    { id: 2, title: 'Course Data Synced', message: 'Database tables initial data loaded successfully.', time: '2 mins ago', read: false, type: 'info' }
  ];

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Students', route: '/students', icon: '🎓', badge: 'Active' },
    { label: 'Courses', route: '/courses', icon: '📚' },
    { label: 'Enrollments', route: '/enrollments', icon: '⚡' },
    { label: 'Analytics', route: '/analytics', icon: '📈' },
    { label: 'Settings', route: '/settings', icon: '⚙️' }
  ];

  @HostListener('window:keydown.control.k', ['$event'])
  @HostListener('window:keydown.meta.k', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    event.preventDefault();
    this.openQuickSearch();
  }

  ngOnInit(): void {}

  get currentRouteTitle(): string {
    const url = this.router.url.split('/')[1] || 'dashboard';
    return url;
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  toggleSidebar(): void {
    this.isExpanded.update(val => !val);
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(val => !val);
    this.showNotifications.set(false);
  }

  toggleNotifications(): void {
    this.showNotifications.update(val => !val);
    this.showUserMenu.set(false);
  }

  openQuickSearch(): void {
    this.showSearchModal.set(true);
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  onSearchInput(q: string): void {
    if (!q || q.trim().length < 2) {
      this.matchingStudents = [];
      this.matchingCourses = [];
      return;
    }
    const query = q.toLowerCase();
    
    this.studentService.getAllStudents().subscribe(students => {
      this.matchingStudents = students.filter(s => s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query));
    });

    this.courseService.getAllCourses().subscribe(courses => {
      this.matchingCourses = courses.filter(c => c.title.toLowerCase().includes(query));
    });
  }

  navigateToStudent(id: number): void {
    this.showSearchModal.set(false);
    this.router.navigate(['/students', id]);
  }

  navigateToCourse(id: number): void {
    this.showSearchModal.set(false);
    this.router.navigate(['/courses', id]);
  }
}
