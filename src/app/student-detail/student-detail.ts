import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StudentRecord, StudentService } from '../student';

@Component({
  selector: 'app-student-detail',
  imports: [RouterLink],
  templateUrl: './student-detail.html',
  styleUrl: './student-detail.css'
})
export class StudentDetail {
  student: StudentRecord | undefined;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private changeDetector: ChangeDetectorRef
  ) {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.studentService.getStudentById(id).subscribe({
      next: data => {
        this.student = data;
        this.isLoading = false;

        this.changeDetector.markForCheck();
      },
      error: error => {
        console.error('Could not load student:', error);

        this.errorMessage = 'Could not load student.';
        this.isLoading = false;

        this.changeDetector.markForCheck();
      }
    });
  }
}