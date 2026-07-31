import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      <!-- Background Ambient Glow Shapes -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      <!-- Login Glass Container -->
      <div class="w-full max-w-md glass-card p-8 sm:p-10 shadow-2xl relative z-10 border border-slate-700/60 backdrop-blur-2xl">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-xl shadow-brand-500/30">
            E
          </div>
          <h1 class="text-2xl font-extrabold text-white tracking-tight">EduTrack Pro</h1>
          <p class="text-xs text-slate-400 mt-1">Enterprise Student Course Management</p>
        </div>

        <!-- Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          
          <!-- Email Input -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
            <div class="relative">
              <input
                type="email"
                formControlName="email"
                placeholder="admin@edutrack.edu"
                class="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>
            <p *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="text-[11px] text-rose-400 mt-1">
              Please enter a valid email address.
            </p>
          </div>

          <!-- Password Input -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
              <button type="button" (click)="openForgotPassword()" class="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">
                Forgot Password?
              </button>
            </div>
            <div class="relative">
              <input
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="••••••••••••"
                class="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-200">
                {{ showPassword() ? '🙈' : '👁️' }}
              </button>
            </div>
            <p *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="text-[11px] text-rose-400 mt-1">
              Password must be at least 6 characters.
            </p>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input type="checkbox" formControlName="rememberMe" class="w-4 h-4 accent-brand-500 rounded bg-slate-800 border-slate-700" />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="isLoading() || loginForm.invalid"
            class="w-full py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-brand-600/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <span *ngIf="isLoading()" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ isLoading() ? 'Signing in...' : 'Sign In to Dashboard' }}</span>
          </button>
        </form>

        <!-- Quick Demo Credentials Hint -->
        <div class="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
          <p class="font-medium text-slate-300 mb-1">Demo Enterprise Access Ready</p>
          <p class="text-[11px] text-slate-500">Email: <span class="text-brand-400">admin&#64;edutrack.edu</span> | Pass: <span class="text-brand-400">admin123</span></p>
        </div>

      </div>

      <!-- Forgot Password Modal -->
      <div *ngIf="showForgotModal()" class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
        <div class="glass-card p-6 w-full max-w-sm border border-slate-700 text-white">
          <h3 class="text-base font-bold mb-2">Reset Account Password</h3>
          <p class="text-xs text-slate-400 mb-4">Enter your registered email address to receive password reset instructions.</p>
          
          <input
            type="email"
            #resetEmail
            placeholder="your-email@domain.com"
            class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white mb-4 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <div class="flex justify-end gap-2">
            <button (click)="closeForgotModal()" class="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white">
              Cancel
            </button>
            <button (click)="sendResetLink(resetEmail.value)" class="px-4 py-2 bg-brand-600 hover:bg-brand-500 font-semibold text-xs text-white rounded-xl shadow-lg">
              Send Instructions
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showForgotModal = signal<boolean>(false);

  loginForm: FormGroup = this.fb.group({
    email: ['admin@edutrack.edu', [Validators.required, Validators.email]],
    password: ['admin123', [Validators.required, Validators.minLength(6)]],
    rememberMe: [true]
  });

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  closeForgotModal(): void {
    this.showForgotModal.set(false);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const { email, password, rememberMe } = this.loginForm.value;

    try {
      await this.authService.login(email, password, rememberMe);
      this.notification.success('Welcome back to EduTrack Pro!');
      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.notification.error('Invalid email or password.');
    } finally {
      this.isLoading.set(false);
    }
  }

  openForgotPassword(): void {
    this.showForgotModal.set(true);
  }

  sendResetLink(email: string): void {
    if (!email) {
      this.notification.error('Please enter your email.');
      return;
    }
    this.notification.success(`Password reset link sent to ${email}`);
    this.showForgotModal.set(false);
  }
}
