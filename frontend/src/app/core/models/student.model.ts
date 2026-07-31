export interface Student {
  id?: number;
  name: string;
  email: string;
  age: number;
  city: string;
  password?: string;
}

export interface StudentRequest {
  name: string;
  email: string;
  age: number;
  city: string;
  password?: string;
}
