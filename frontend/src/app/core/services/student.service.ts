import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, retry, tap, throwError } from 'rxjs';
import { Student, StudentRequest } from '../models/student.model';
import { PagedResponse } from '../models/paged-response.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly baseUrl = 'http://localhost:8080/api/students';

  readonly students = signal<Student[]>([]);
  readonly selectedStudent = signal<Student | null>(null);

  constructor(
    private http: HttpClient,
    private notification: NotificationService
  ) {}

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl).pipe(
      retry(1),
      tap(data => this.students.set(data)),
      catchError(err => this.handleError('Failed to fetch students', err))
    );
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`).pipe(
      retry(1),
      tap(data => this.selectedStudent.set(data)),
      catchError(err => this.handleError(`Failed to fetch student #${id}`, err))
    );
  }

  createStudent(student: StudentRequest): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, student).pipe(
      tap(created => {
        this.students.update(list => [created, ...list]);
        this.notification.success('Student registered successfully!');
      }),
      catchError(err => this.handleError('Failed to create student', err))
    );
  }

  updateStudent(id: number, student: StudentRequest): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${id}`, student).pipe(
      tap(updated => {
        this.students.update(list => list.map(s => s.id === id ? updated : s));
        this.notification.success('Student profile updated successfully!');
      }),
      catchError(err => this.handleError(`Failed to update student #${id}`, err))
    );
  }

  deleteStudent(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' }).pipe(
      tap(() => {
        this.students.update(list => list.filter(s => s.id !== id));
        this.notification.success(`Student deleted successfully.`);
      }),
      catchError(err => this.handleError(`Failed to delete student #${id}`, err))
    );
  }

  searchByEmail(email: string): Observable<Student> {
    const params = new HttpParams().set('email', email);
    return this.http.get<Student>(`${this.baseUrl}/search/email`, { params }).pipe(
      catchError(err => this.handleError('No student found with that email', err))
    );
  }

  searchByCity(city: string): Observable<Student[]> {
    const params = new HttpParams().set('city', city);
    return this.http.get<Student[]>(`${this.baseUrl}/search/city`, { params }).pipe(
      catchError(err => this.handleError('Failed to search students by city', err))
    );
  }

  searchByName(keyword: string): Observable<Student[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Student[]>(`${this.baseUrl}/search/name`, { params }).pipe(
      catchError(err => this.handleError('Search by name failed', err))
    );
  }

  getStudentsPaged(pageNo: number = 0, pageSize: number = 10, sortBy: string = 'id', sortDir: string = 'asc'): Observable<PagedResponse<Student>> {
    const params = new HttpParams()
      .set('pageNo', pageNo)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PagedResponse<Student>>(`${this.baseUrl}/page`, { params }).pipe(
      retry(1),
      catchError(err => this.handleError('Failed to load paginated students', err))
    );
  }

  private handleError(message: string, error: any) {
    const errorMsg = error?.error?.message || error?.statusText || message;
    this.notification.error(errorMsg);
    return throwError(() => new Error(errorMsg));
  }
}
