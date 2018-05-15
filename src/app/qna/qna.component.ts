import { LogService } from 'ng2-log-service';
import { WebSocketService } from './../shared/services/websocket.service';
import { UserService } from './../shared/services/user.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserQAService } from './../shared/services/user-qa.service';

import { UserQuestion } from './../shared/models/user-question.model';

@Component({
  selector: 'app-qna',
  templateUrl: './qna.component.html',
  styleUrls: ['./qna.component.css'],
  providers: [LogService]
})
export class QnaComponent implements OnInit {

  public sidebarCollapsed: boolean = false;
  private connectionSubscription: Subscription;
  private connectionObserver: Subject<any>;
  public callEvent: any;
  public loading: boolean;
  public qnaData: UserQuestion[] = [];
  public selectedQuestion: UserQuestion;
  private start: number;
  private count: number;
  private listCompleted: boolean;
 
  constructor(private userQAService: UserQAService,
    private userService: UserService,
    private connectionService: WebSocketService,
    private logService: LogService) {
    this.logService.namespace = 'QnaComponent';
  }
  
  ngOnInit() {
    this.loading = true;
    this.start = 0;
    this.count = 10;
    this.listCompleted = false;
    this.connect();
    this.getQAList(this.start, this.count);
  }

  
  connect() {
    this.connectionObserver = this.connectionService.connect();
    this.connectionSubscription = this.connectionObserver.subscribe(
      (event) => {
        if (event.type == 'open') {
          this.logService.info('Connection Opened');
          var obj = { event: 'socketOpened', timestamp: Date.now() };
          this.callEvent = JSON.stringify(obj);
        } else if (event.type == 'message') {
          this.logService.info('Message Received ', event.data);
          this.callEvent = event.data;
        }
      },
      (error) => {
        this.logService.error(error);
        setTimeout(this.connect.bind(this), 5000);
      },
      () => {
        this.logService.info('The socket connection is closed');
        setTimeout(this.connect.bind(this), 5000);
      }
    );
  }

  ngOnDestroy() {
    this.connectionSubscription.unsubscribe();
  }

  onNewCallOutEvent(eventData: any) {
    this.connectionObserver.next(eventData);
  }

  getQAList(start: number, count: number) {
    if (!this.listCompleted) {
      this.userQAService.getQAList(start, count).subscribe(
        data => {
          this.logService.debug('Received getQAList response', data);
          if (data.questionList.length > 0) {
            if (this.qnaData.length == 0) {
              this.qnaData = data.questionList;
              if (this.qnaData && this.qnaData.length > 0) {
                this.selectedQuestion = this.qnaData[0];
                this.selectedQuestion.isActive = true;
              }
            } else {
              this.qnaData.push.apply(this.qnaData, data.questionList);
            }
            this.start = this.qnaData.length;
          } else {
            this.listCompleted = true;
          }
          this.loading = false;
        },
        error => {
          this.logService.error(error);
          this.loading = false;
        });
    }

  }

  sidebarButtonToggled(toggled: boolean) {
    this.sidebarCollapsed = toggled;
  }

  onQuestionSelected(question: UserQuestion) {
    if (this.selectedQuestion) {
      this.selectedQuestion.isActive = false;
    }
    this.selectedQuestion = question;
  }

  onScrolledDown() {
    this.getQAList(this.start, this.count);
  }

}
