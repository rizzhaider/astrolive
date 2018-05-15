import { LogService } from 'ng2-log-service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./timer.component.css'],
  providers: [LogService]
})
export class TimerComponent implements OnInit, OnDestroy {
  private timerId: any;
  public displayTimer: string;
  private checkInterval: any;

  constructor(private ref: ChangeDetectorRef, private logService: LogService) {
    this.logService.namespace = 'TimerComponent';
    ref.detach();
    this.checkInterval = setInterval(() => {
      this.ref.detectChanges();
    }, 1000);
  }

  ngOnInit() {
    this.displayTimer = "00:00:00";
  }

  ngOnDestroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  startCallTimer() {
    this.logService.info('Timer is ', this.timerId);
    if (!this.timerId) {
      var callStartTime = new Date(); // Store Call Start Time
      var callElapsedTime = Math.round((new Date().getTime() - callStartTime.getTime()) / 1000); // Store Call Elapsed Time
      var now, before = new Date();
      var hoursStr: string;
      var minutesStr: string;
      var secondsStr: string;
      this.timerId = setInterval(() => {

        var now = new Date();
        var elapsedTimeSinceLast = Math.round((now.getTime() - before.getTime()) / 1000); //elapsed time in seconds still last execution 
        var totalElapsedTime = callElapsedTime;
        totalElapsedTime = totalElapsedTime + elapsedTimeSinceLast;
        callElapsedTime = totalElapsedTime;
        before = new Date();

        var elapsedTime = callElapsedTime;
        var seconds = Math.round(elapsedTime % 60);
        elapsedTime = Math.floor(elapsedTime / 60);
        var minutes = Math.round(elapsedTime % 60);
        var hours = Math.floor(elapsedTime / 60);


        if (hours < 10) {
          hoursStr = "0" + hours;
        } else {
          hoursStr = "" + hours;
        }

        if (minutes < 10) {
          minutesStr = "0" + minutes;
        } else {
          minutesStr = "" + minutes;
        }

        if (seconds < 10) {
          secondsStr = "0" + seconds;
        } else {
          secondsStr = "" + seconds;
        }

        this.displayTimer = hoursStr + ":" + minutesStr + ":" + secondsStr;
      }, 1000);
    }
  };

  endCallTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.logService.info('Cleared timer');
      this.timerId = null;
    }
  };

}
