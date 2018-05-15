import { UserQuestion } from './../../shared/models/user-question.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-qna-list',
  templateUrl: './qna-list.component.html',
  styleUrls: ['./qna-list.component.css']
})
export class QnaListComponent implements OnInit {
  @Input() qnaData: UserQuestion[] = [];
  @Output() questionSelected: EventEmitter<UserQuestion> = new EventEmitter();
  @Output() scrolledDown: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }

  onQuestionSelected(question: UserQuestion) {
     this.questionSelected.emit(question);
  }

  onScroll() {
   this.scrolledDown.emit();
  }

}
