import { LogService } from 'ng2-log-service';
import { WebSocketService } from './../shared/services/websocket.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UserTipsService } from './../shared/services/user-tips.service';

import { UserService } from './../shared/services/user.service';
import { Tip } from './../shared/models/user-tip';

@Component({
	selector: 'app-tips',
	templateUrl: './tips.component.html',
	styleUrls: ['./tips.component.css'],
	providers: [LogService]
})
export class TipsComponent implements OnInit {
	public sidebarCollapsed: boolean = false;
	public userId: string;
	public tipText: string;
	public event: string;
	private connectionSubscription: Subscription;
	private connectionObserver: Subject<any>;
	public callEvent: any;
  public loading: boolean;
	public tipsData: Tip[] = [];
	

	constructor(private userTipsService: UserTipsService,
		private userService: UserService,
		private connectionService: WebSocketService,
		private logService: LogService) {
			this.logService.namespace = 'TipsComponent';
		 }

	ngOnInit() {
		this.loading = true;
		this.connect();
		this.getAstroTips();
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

	getAstroTips() {
		this.userTipsService.getAstroTips(this.userService.getUser()).subscribe(
			data => {
				this.logService.debug('Received getAstroTips response', data.tips);
				this.tipsData = data.tips;
				this.loading = false;
			},
			error => {
				this.logService.error(error);
				this.loading = false;
			});
	}


	addAstroTip() {
		if (this.tipText && this.tipText.trim().length > 0) {
			this.userTipsService.addAstroTip(this.userService.getUser(), this.tipText.trim()).subscribe(
			data => {
				this.logService.info('Received addAstroTip response', data);
				this.tipText = '';
				this.getAstroTips();
			},
			error => {
				this.logService.error(error);
			});
		} else {
			this.tipText = '';
		}
		
	}


	deleteAstroTip(tip: Tip) {
		this.userTipsService.deleteAstroTip(this.userService.getUser(), tip.id).subscribe(
			data => {
				this.logService.info('Received deleteAstroTip response', data);
				this.getAstroTips();
			},
			error => {
				this.logService.error(error);
			});
	}

	onTipUpdated(event: any) {
		this.getAstroTips();
	}

	
	sidebarButtonToggled(toggled: boolean) {
		this.sidebarCollapsed = toggled;
	}
}
