import { Astrologer } from './../../../shared/models/astrologer.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-answer-item',
  templateUrl: './answer-item.component.html',
  styleUrls: ['./answer-item.component.css']
})
export class AnswerItemComponent implements OnInit {
  @Input() public answer: Astrologer;
  constructor() { }

  ngOnInit() {
  }

}
