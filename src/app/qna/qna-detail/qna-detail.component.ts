import { LogService } from 'ng2-log-service';
import { Astrologer } from './../../shared/models/astrologer.model';
import { UserService } from './../../shared/services/user.service';
import { UserQAService } from './../../shared/services/user-qa.service';
import { UserQuestion } from './../../shared/models/user-question.model';
import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-qna-detail',
  templateUrl: './qna-detail.component.html',
  styleUrls: ['./qna-detail.component.css'],
  providers: [DatePipe, LogService]
})
export class QnaDetailComponent implements OnInit {
  @Input() public question: UserQuestion;
  public answerText: string;

  constructor(private userQAService: UserQAService,
    private userService: UserService,
    private datePipe: DatePipe,
    private logService: LogService) {
      this.logService.namespace = 'QnaDetailComponent';
     }

  ngOnInit() {
  }

  transformDate(date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  addAnswer() {
    if (this.answerText.trim().length > 0) {
        let answerData = {
      userType: '1',
      userId: this.userService.getUser(),
      questionId: this.question.questionId,
      question: '',
      answer: this.answerText,
      userAction: 1,
      answerId: null
    }

    this.userQAService.addAnswer(answerData).subscribe(
      data => {
        this.logService.debug('Received addAnswer response', data);
        let answer = new Astrologer();
        answer.answer = this.answerText;
        answer.astroId = this.userService.getUser();
        answer.astroImgUrl = this.userService.getUserDetails().imgUrl;
        answer.astroName = this.userService.getUserDetails().name;
        answer.time = this.transformDate(new Date());

        this.question.astroList.unshift(answer);
        this.answerText = '';
    },
      error => {
        this.logService.error(error)
      });
    } else {
        this.answerText = '';
    }
    
  }

}
