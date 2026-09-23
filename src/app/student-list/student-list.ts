import { ChangeDetectorRef, Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentCard } from '../student-card/student-card';
import { StudentRecord, StudentService } from '../student';
import { AddStudent } from '../add-student/add-student';

@Component({
  selector: 'app-student-list',
  imports: [DecimalPipe, FormsModule, StudentCard, AddStudent],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentList {
  students: StudentRecord[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  showFavouritesOnly = false;

  constructor(
    private studentService: StudentService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.studentService.getStudents().subscribe({
      next: data => {
        this.students = data;
        this.isLoading = false;

        this.changeDetector.markForCheck();
      },
      error: error => {
        console.error('Could not load students:', error);

        this.errorMessage = 'Could not load students.';
        this.isLoading = false;

        this.changeDetector.markForCheck();
      }
    });
  }

  get filteredStudents(): StudentRecord[] {
    return this.students.filter(student =>
      student.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }

  get displayedStudents(): StudentRecord[] {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    return this.students.filter(student =>
      student.name.toLowerCase().includes(normalizedSearch) &&
      (!this.showFavouritesOnly || student.favourite)
    );
  }

  toggleFavourite(id: number): void {
    this.studentService.toggleFavourite(id);
  }

  deleteStudent(id: number): void {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.changeDetector.markForCheck();
      },
      error: err => {
        console.error(err);
      }
    });
  }

}