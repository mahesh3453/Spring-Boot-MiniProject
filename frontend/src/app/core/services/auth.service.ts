import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly currentUser = signal<User | null>(this.getStoredUser());
  readonly token = signal<string | null>(localStorage.getItem('edutrack_token'));
  readonly isAuthenticated = computed(() => !!this.currentUser() && !!this.token());

  constructor(private router: Router) {}

  private getStoredUser(): User | null {
    const raw = localStorage.getItem('edutrack_user');
    if (!raw) {
      // Default demo user session ready out-of-the-box
      const demoUser: User = {
        id: 1,
        name: 'Dr. Sarah Vance',
        email: 'sarah.vance@edutrack.edu',
        role: 'ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      };
      localStorage.setItem('edutrack_user', JSON.stringify(demoUser));
      localStorage.setItem('edutrack_token', 'mock-jwt-token-edutrack-2026');
      return demoUser;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  login(email: string, pass: string, remember: boolean = true): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: 101,
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          email: email,
          role: 'ADMIN',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        };
        const mockToken = `jwt-token-${Date.now()}`;
        
        if (remember) {
          localStorage.setItem('edutrack_user', JSON.stringify(user));
          localStorage.setItem('edutrack_token', mockToken);
        }
        
        this.currentUser.set(user);
        this.token.set(mockToken);
        resolve(true);
      }, 800);
    });
  }

  logout(): void {
    localStorage.removeItem('edutrack_user');
    localStorage.removeItem('edutrack_token');
    this.currentUser.set(null);
    this.token.set(null);
    this.router.navigate(['/login']);
  }
}
