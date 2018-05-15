import { Astrologer } from './../../../shared/models/astrologer.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-answer-list',
  templateUrl: './answer-list.component.html',
  styleUrls: ['./answer-list.component.css']
})
export class AnswerListComponent implements OnInit {
  @Input() public answerList: Astrologer[] = [];

  constructor() { }

  ngOnInit() {
  }

}
