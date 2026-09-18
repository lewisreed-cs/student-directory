import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, of } from 'rxjs';

export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface StudentRecord {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
  score?: number;
  favourite: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  private students: StudentRecord[] = [];

  private studentsSubject = new ReplaySubject<StudentRecord[]>(1);

  constructor(private http: HttpClient) {
    this.http
      .get<StudentRecord[]>(this.apiUrl)
      .subscribe({
        next: data => {
          this.students = data;
          this.studentsSubject.next(this.students);
        },
        error: error => {
          this.studentsSubject.error(error);
        }
      });
  }

  getStudents(): Observable<StudentRecord[]> {
    return this.studentsSubject.asObservable();
  }

  getStudentById(id: number): Observable<StudentRecord> {
    const existingStudent =
      this.students.find(student => student.id === id);

    if (existingStudent) {
      return of(existingStudent);
    }

    return this.http.get<StudentRecord>(
      `${this.apiUrl}/${id}`
    );
  }

  addStudent(student: StudentRecord): void {
    this.students.push(student);

    this.studentsSubject.next([...this.students]);
  }

  toggleFavourite(id: number): void {
    const student = this.students.find(student => student.id === id);

    if (student) {
      student.favourite = !student.favourite;
    }
  }

}