import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, retry, tap, throwError } from 'rxjs';
import { Enrollment, EnrollmentRequest } from '../models/enrollment.model';
import { Course } from '../models/course.model';
import { Student } from '../models/student.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private readonly baseUrl = 'http://localhost:8080/api/enrollments';

  readonly enrollments = signal<Enrollment[]>([]);

  constructor(
    private http: HttpClient,
    private notification: NotificationService
  ) {}

  getAllEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.baseUrl).pipe(
      retry(1),
      tap(data => this.enrollments.set(data)),
      catchError(err => this.handleError('Failed to fetch enrollments', err))
    );
  }

  enrollStudent(request: EnrollmentRequest): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.baseUrl, request).pipe(
      tap(created => {
        this.enrollments.update(list => [created, ...list]);
        this.notification.success('Student enrolled into course successfully!');
      }),
      catchError(err => this.handleError('Failed to enroll student', err))
    );
  }

  cancelEnrollment(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' }).pipe(
      tap(() => {
        this.enrollments.update(list => list.filter(e => e.enrollmentId !== id));
        this.notification.success('Enrollment cancelled successfully.');
      }),
      catchError(err => this.handleError(`Failed to cancel enrollment #${id}`, err))
    );
  }

  getCoursesByStudentId(studentId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/student/${studentId}/courses`).pipe(
      retry(1),
      catchError(err => this.handleError(`Failed to fetch courses for student #${studentId}`, err))
    );
  }

  getStudentsByCourseId(courseId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/course/${courseId}/students`).pipe(
      retry(1),
      catchError(err => this.handleError(`Failed to fetch students for course #${courseId}`, err))
    );
  }

  private handleError(message: string, error: any) {
    const errorMsg = error?.error?.message || error?.statusText || message;
    this.notification.error(errorMsg);
    return throwError(() => new Error(errorMsg));
  }
}
