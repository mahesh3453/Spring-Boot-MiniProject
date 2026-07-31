import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, retry, tap, throwError } from 'rxjs';
import { Course, CourseRequest } from '../models/course.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly baseUrl = 'http://localhost:8080/api/courses';

  readonly courses = signal<Course[]>([]);
  readonly selectedCourse = signal<Course | null>(null);

  constructor(
    private http: HttpClient,
    private notification: NotificationService
  ) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl).pipe(
      retry(1),
      tap(data => this.courses.set(data)),
      catchError(err => this.handleError('Failed to fetch courses', err))
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`).pipe(
      retry(1),
      tap(data => this.selectedCourse.set(data)),
      catchError(err => this.handleError(`Failed to fetch course #${id}`, err))
    );
  }

  createCourse(course: CourseRequest): Observable<Course> {
    return this.http.post<Course>(this.baseUrl, course).pipe(
      tap(created => {
        this.courses.update(list => [created, ...list]);
        this.notification.success('Course created successfully!');
      }),
      catchError(err => this.handleError('Failed to create course', err))
    );
  }

  updateCourse(id: number, course: CourseRequest): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/${id}`, course).pipe(
      tap(updated => {
        this.courses.update(list => list.map(c => c.id === id ? updated : c));
        this.notification.success('Course details updated successfully!');
      }),
      catchError(err => this.handleError(`Failed to update course #${id}`, err))
    );
  }

  deleteCourse(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' }).pipe(
      tap(() => {
        this.courses.update(list => list.filter(c => c.id !== id));
        this.notification.success('Course deleted successfully.');
      }),
      catchError(err => this.handleError(`Failed to delete course #${id}`, err))
    );
  }

  getCourseByTitle(title: string): Observable<Course> {
    const params = new HttpParams().set('title', title);
    return this.http.get<Course>(`${this.baseUrl}/search`, { params }).pipe(
      catchError(err => this.handleError('No course found matching that title', err))
    );
  }

  getCoursesByFeeRange(minFee: number, maxFee: number): Observable<Course[]> {
    const params = new HttpParams()
      .set('minFee', minFee)
      .set('maxFee', maxFee);
    return this.http.get<Course[]>(`${this.baseUrl}/fee-range`, { params }).pipe(
      catchError(err => this.handleError('Failed to fetch courses by fee range', err))
    );
  }

  private handleError(message: string, error: any) {
    const errorMsg = error?.error?.message || error?.statusText || message;
    this.notification.error(errorMsg);
    return throwError(() => new Error(errorMsg));
  }
}
