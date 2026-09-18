import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { StudentRecord, StudentService } from '../student';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-add-student',
  styleUrl: './add-student.css',
  templateUrl: './add-student.html',
})
export class AddStudent {
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

    const newStudent: StudentRecord = {
      id: Date.now(),
      name: this.addStudentForm.controls.name.value,
      score: this.addStudentForm.controls.score.value!,
      favourite: false,
      username: '',
      email: '',
      phone: '',
      website: '',
      address: {
        street: '',
        suite: '',
        city: '',
        zipcode: '',
        geo: {
          lat: '',
          lng: ''
        }
      },
      company: {
        name: '',
        catchPhrase: '',
        bs: ''
      }
    };

    this.studentService.addStudent(newStudent);
    this.router.navigate(['/']);
  }
}