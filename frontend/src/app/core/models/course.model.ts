export interface Course {
  id?: number;
  title: string;
  description: string;
  fee: number;
  durationInWeeks: number;
}

export interface CourseRequest {
  title: string;
  description: string;
  fee: number;
  durationInWeeks: number;
}
