import { Routes } from '@angular/router';
import { StudentDetail } from './student-detail/student-detail';
import { StudentList } from './student-list/student-list';
import { AddStudent } from './add-student/add-student';

export const routes: Routes = [
    {
        path: '',
        component: StudentList
    },
    {
        path: 'student/add',
        component: AddStudent
    },
    {
        path: 'student/:id',
        component: StudentDetail
    }
]
