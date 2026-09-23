import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, catchError, map, of, throwError } from 'rxjs';

export interface StudentRecord {
  id: number;
  name: string;
  score: number;
  favourite?: boolean;
}

export interface NewStudent {
  name: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:5195/api/Students';
  private readonly favouritesStorageKey = 'student-directory:favourites';
  private favouriteIds = new Set<number>(this.loadFavouriteIds());

  private students: StudentRecord[] = [];

  private studentsSubject = new ReplaySubject<StudentRecord[]>(1);

  constructor(private http: HttpClient) {
    this.http
      .get<StudentRecord[]>(this.apiUrl)
      .subscribe({
        next: data => {
          this.students = data.map(student => this.withFavouriteState(student));
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

    return this.http.get<StudentRecord>(`${this.apiUrl}/${id}`).pipe(
      map(student => this.withFavouriteState(student))
    );
  }

  toggleFavourite(id: number): void {
    if (this.favouriteIds.has(id)) {
      this.favouriteIds.delete(id);
    } else {
      this.favouriteIds.add(id);
    }

    this.persistFavouriteIds();
    this.students = this.students.map(student =>
      student.id === id
        ? this.withFavouriteState(student)
        : student
    );
    this.studentsSubject.next(this.students);
  }

  addStudent(student: NewStudent): Observable<StudentRecord> {
    const temporaryStudent: StudentRecord = {
      id: Date.now(),
      ...student
    };

    this.students = [...this.students, temporaryStudent];
    this.studentsSubject.next(this.students);

    return this.http.post<StudentRecord>(
      this.apiUrl,
      student
    ).pipe(
      map(createdStudent => {
        const savedStudent: StudentRecord = {
          id: createdStudent?.id ?? temporaryStudent.id,
          name: createdStudent?.name ?? temporaryStudent.name,
          score: createdStudent?.score ?? temporaryStudent.score,
          favourite: temporaryStudent.favourite
        };

        this.students = this.students.map(currentStudent =>
          currentStudent.id === temporaryStudent.id
            ? savedStudent
            : currentStudent
        );
        this.studentsSubject.next(this.students);
        return savedStudent;
      }),
      catchError(error => {
        this.students = this.students.filter(
          currentStudent => currentStudent.id !== temporaryStudent.id
        );
        this.studentsSubject.next(this.students);
        return throwError(() => error);
      })
    );
  }

  deleteStudent(id: number): Observable<void> {
    const deletedIndex = this.students.findIndex(student => student.id === id);
    const deletedStudent = this.students[deletedIndex];

    this.students = this.students.filter(student => student.id !== id);
    this.favouriteIds.delete(id);
    this.persistFavouriteIds();
    this.studentsSubject.next(this.students);

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    ).pipe(
      catchError(error => {
        if (deletedStudent) {
          this.students = [
            ...this.students.slice(0, deletedIndex),
            deletedStudent,
            ...this.students.slice(deletedIndex)
          ];
        }

        this.studentsSubject.next(this.students);
        return throwError(() => error);
      })
    );
  }

  private withFavouriteState(student: StudentRecord): StudentRecord {
    return {
      ...student,
      favourite: this.favouriteIds.has(student.id)
    };
  }

  private loadFavouriteIds(): number[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const storedIds = JSON.parse(
        localStorage.getItem(this.favouritesStorageKey) ?? '[]'
      );

      return Array.isArray(storedIds)
        ? storedIds.filter((id): id is number => typeof id === 'number')
        : [];
    } catch {
      return [];
    }
  }

  private persistFavouriteIds(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        this.favouritesStorageKey,
        JSON.stringify([...this.favouriteIds])
      );
    }
  }

}