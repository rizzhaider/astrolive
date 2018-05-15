import { FilterPipe } from './../shared/pipes/filter.pipe';
import { CallHistoryService } from './../shared/services/callhistory.service';
import { LogService } from 'ng2-log-service';
import { WebSocketService } from './../shared/services/websocket.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Input, ViewChild, AfterViewInit, PipeTransform } from '@angular/core';

import { UserService } from './../shared/services/user.service';

@Component({
	selector: 'app-callhistory',
	templateUrl: './callhistory.component.html',
	styleUrls: ['./callhistory.component.css'],
	providers: [LogService, FilterPipe]
})
export class CallHistoryComponent implements OnInit {
	public sidebarCollapsed: boolean = false;
	public userId: string;
  public event: string;
	private connectionSubscription: Subscription;
	private connectionObserver: Subject<any>;
	public callEvent: any;
  public loading: boolean;
  public callHistory: any[];
	public totalCalls: number = 0;
	public totalMissedCalls: number = 0;
	public filterStatus: string = "";
	public readonly defaultMissedStatus = "Not Answered by Astro";
	


	constructor(
		private userService: UserService,
		private connectionService: WebSocketService,
		private logService: LogService,
    private callHistoryService: CallHistoryService,
		private filterPipe: FilterPipe) {
		this.logService.namespace = 'CallHistoryComponent';
		 }

	ngOnInit() {
		this.loading = true;
    this.callHistory = [];
		this.connect();
		this.getCallHistory();
	}

	

connect() {
    this.connectionObserver = this.connectionService.connect();
    this.connectionSubscription = this.connectionObserver.subscribe(
      (event) => {
        if (event.type == 'open') {
          this.logService.info('Connection Opened');
					var obj = {event: 'socketOpened', timestamp: Date.now()};
          this.callEvent = JSON.stringify(obj);
        } else if (event.type == 'message') {
          this.logService.info('Message Received ' + event.data);
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

	getCallHistory() {
		this.callHistoryService.getCallHistory(this.userService.getUser()).subscribe(
			data => {
				this.logService.info('Received getCallHistory response', data.data);
				this.callHistory = data.data;
				this.totalCalls = this.callHistory.length;
				let missedCallHistory = this.filterPipe.transform(this.callHistory, this.defaultMissedStatus, 7);
				this.totalMissedCalls = missedCallHistory.length;
				this.loading = false;
			},
			error => {
				this.logService.error(error);
				this.loading = false;
			});
	}


  sidebarButtonToggled(toggled: boolean) {
		this.sidebarCollapsed = toggled;
	}

	onSelectMissed () {
		//this.filterStatus = 'Missed Call';
		this.filterStatus = this.defaultMissedStatus;
	}

	onSelectAll() {
		this.filterStatus = '';
	}

	onCallTerminated() {
		setTimeout(() => this.getCallHistory(), 2000);
	}

}
