import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-card',
  imports: [RouterLink],
  templateUrl: './student-card.html',
  styleUrl: './student-card.css'
})
export class StudentCard {
  @Input() id = 0;
  @Input() name = '';
  @Input() score = 0;
  @Input() favourite = false;
  @Output() favouriteToggled = new EventEmitter<number>();
  @Output() studentDeleted = new EventEmitter<number>();

  toggleFavourite(): void {
    this.favouriteToggled.emit(this.id);
  }

  deleteStudent(): void {
    this.studentDeleted.emit(this.id);
  }
}