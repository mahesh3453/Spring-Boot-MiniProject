import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'students',
        loadComponent: () => import('./pages/students/student-list/student-list.component').then(m => m.StudentListComponent)
      },
      {
        path: 'students/:id',
        loadComponent: () => import('./pages/students/student-profile/student-profile.component').then(m => m.StudentProfileComponent)
      },
      {
        path: 'courses',
        loadComponent: () => import('./pages/courses/course-list/course-list.component').then(m => m.CourseListComponent)
      },
      {
        path: 'courses/:id',
        loadComponent: () => import('./pages/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
      },
      {
        path: 'enrollments',
        redirectTo: 'enrollments/history',
        pathMatch: 'full'
      },
      {
        path: 'enrollments/wizard',
        loadComponent: () => import('./pages/enrollments/enrollment-wizard/enrollment-wizard.component').then(m => m.EnrollmentWizardComponent)
      },
      {
        path: 'enrollments/history',
        loadComponent: () => import('./pages/enrollments/enrollment-history/enrollment-history.component').then(m => m.EnrollmentHistoryComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
