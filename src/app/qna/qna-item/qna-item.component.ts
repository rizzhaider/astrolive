import { UserQuestion } from './../../shared/models/user-question.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-qna-item',
  templateUrl: './qna-item.component.html',
  styleUrls: ['./qna-item.component.css']
})
export class QnaItemComponent implements OnInit {
  @Input() public question: UserQuestion;
  @Output() public questionSelected: EventEmitter<any> = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }

  onSelectQuestion() {
      this.questionSelected.emit();
      this.question.isActive = true;
  }

}
