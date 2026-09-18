import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentCard } from '../student-card/student-card';
import { StudentRecord, StudentService } from '../student';
import { AddStudent } from '../add-student/add-student';

@Component({
  selector: 'app-student-list',
  imports: [FormsModule, StudentCard, AddStudent],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentList {
  students: StudentRecord[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  showDetails = false;
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

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  toggleFavourite(id: number): void {
    this.studentService.toggleFavourite(id);
  }

  get displayedStudents(): StudentRecord[] {
    if (this.showFavouritesOnly) {
      return this.students.filter(student => student.favourite);
    }

    return this.students;
  }

}