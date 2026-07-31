export interface Enrollment {
  enrollmentId?: number;
  studentId: number;
  studentName?: string;
  courseId: number;
  courseTitle?: string;
  enrollmentDate?: string;
  grade?: string;
}

export interface EnrollmentRequest {
  studentId: number;
  courseId: number;
}
