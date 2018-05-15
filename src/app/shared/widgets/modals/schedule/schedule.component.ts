import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../../services/authentication.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  providers: [DatePipe]
})
export class ScheduleComponent implements OnInit {
  @ViewChild('AstroScheduleModal') _AstroScheduleModal: any;


  public dt: Date = new Date();
  public minDate: Date = void 0;
  public events: any[];
  public tomorrow: Date;
  public afterTomorrow: Date;
  public dateDisabled: { date: Date, mode: string }[];
  public formats: string[] = ['DD-MM-YYYY', 'YYYY/MM/DD', 'DD.MM.YYYY',
    'shortDate'];
  public format: string = this.formats[0];
  public dateOptions: any = {
    formatYear: 'YY',
    startingDay: 1
  };
  private opened: boolean = false;
  public isPastTime: boolean = false;

  public mytime: Date;

  public constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private datePipe: DatePipe) {
    (this.tomorrow = new Date()).setDate(this.tomorrow.getDate() + 1);
    (this.afterTomorrow = new Date()).setDate(this.tomorrow.getDate() + 2);
    (this.minDate = new Date()).setDate(this.minDate.getDate());
    (this.dateDisabled = []);
    this.events = [
      { date: this.tomorrow, status: 'full' },
      { date: this.afterTomorrow, status: 'partially' }
    ];



  }

  ngOnInit() {
   
  }

  public getDate(): number {
    return this.dt && this.dt.getTime() || new Date().getTime();
  }

  public today(): void {
    this.dt = new Date();
  }

  public d20090824(): void {
    this.dt = moment('2009-08-24', 'YYYY-MM-DD')
      .toDate();
  }

  public disableTomorrow(): void {
    this.dateDisabled = [{ date: this.tomorrow, mode: 'day' }];
  }

  // todo: implement custom class cases
  public getDayClass(date: any, mode: string): string {
    if (mode === 'day') {
      let dayToCheck = new Date(date).setHours(0, 0, 0, 0);

      for (let event of this.events) {
        let currentDay = new Date(event.date).setHours(0, 0, 0, 0);

        if (dayToCheck === currentDay) {
          return event.status;
        }
      }
    }

    return '';
  }

  public disabled(date: Date, mode: string): boolean {
    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
  }

  public open(): void {
    this.opened = !this.opened;
  }

  public clear(): void {
    this.dt = void 0;
    this.dateDisabled = undefined;
  }

  public toggleMin(): void {
    this.dt = new Date(this.minDate.valueOf());
  }






  openModal() {
    this.mytime = new Date();
    this.mytime.setHours(this.mytime.getHours() + 1);
    var min = this.mytime.getMinutes();
    min = min < 30 ? 0 : 30;
    this.mytime.setMinutes(min);
    this.isPastTime = false;
    this._AstroScheduleModal.show();
  }

  onLogout() {
    this.isPastTime = false;
    let date = this.datePipe.transform(this.dt, 'dd-MM-yyyy');
    let time = this.datePipe.transform(this.mytime, 'HH:mm');
    let today: Date = new Date();
    if (this.dt.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
      //If selected date is of Today
      if (this.mytime < new Date()) {
        // If time is in the past
        this.isPastTime = true;
        return;
      } 
    }
  
  this.authenticationService.logout(date, time);
  this.router.navigate(['login']);

  }


}
