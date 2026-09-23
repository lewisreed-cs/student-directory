import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { NewStudent, StudentService } from '../student';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-add-student',
  styleUrl: './add-student.css',
  templateUrl: './add-student.html',
})
export class AddStudent {
  isSubmitting = false;

  addStudentForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2)
      ]
    }),

    score: new FormControl<number | null>(null, {
      validators: [Validators.required]
    })
  });

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.addStudentForm.invalid) {
      this.addStudentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const newStudent: NewStudent = {
      name: this.addStudentForm.controls.name.value,
      score: this.addStudentForm.controls.score.value!
    };

    this.studentService.addStudent(newStudent).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.addStudentForm.reset();
        this.router.navigate(['/']);
      },
      error: err => {
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }
}