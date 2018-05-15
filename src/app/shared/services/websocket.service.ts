import { UserWebDeviceService } from './user-web-device.service';
import { environment } from './../../../environments/environment';
import { UserDeviceInfo } from './../models/user-device-info';
import { UserDeviceInfoService } from './user-device-info.service';
import { UserService } from './user.service';
import { UserPresenceService } from './user-presence.service';
import { PresenceStatus } from '../enums/presence-status.enum';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Observer } from "rxjs/Observer";
import { LogService, LogLevel, ILogMessage } from 'ng2-log-service';

@Injectable()
export class WebSocketService {
	private socket: Subject<MessageEvent>;
	private heartBeatTimer: any;
	private websocketURL: string = environment.baseWSURI;
	private userId: string;
	private deviceId: string;
	

	constructor(private presenceService: UserPresenceService,
		private userService: UserService,
		private userDeviceService: UserDeviceInfoService,
		private userWebDeviceService: UserWebDeviceService,
		private logService: LogService) { 
			this.deviceId = userWebDeviceService.getDevice();
		};

	public connect(): Subject<MessageEvent> {
		if (!this.socket) {
			let _url = this.websocketURL;
			this.userId = this.userService.getUser();
			_url = _url + '/' + this.userId + '/' + this.deviceId;
			this.socket = this.create(_url);
		}
		return this.socket;
	}

	public getConnection(): Subject<MessageEvent> {
		return this.socket;
	}

	private create(url: string): Subject<MessageEvent> {
		let ws = new WebSocket(url);
		
		let observable = Observable.create(
			(obs: Observer<MessageEvent>) => {
				ws.onopen = (event: MessageEvent) => {
					this.logService.info('WebsocketService: Connection Opened. Update Current Presence');
					
					// Update Presence Status

					let userId = this.userService.getUser();
					let deviceId = (new Date()).getTime();

					let status = this.userService.getPresenceStatus();
					
					if (!status || status === PresenceStatus.OFFLINE.toString()) {
						status = PresenceStatus.ONLINE.toString();
					}

					this.presenceService.updatePresence(userId, status).subscribe(
						data => {
							this.logService.debug('WebsocketService: Received updatePresence response', data);
							},
						error => {
							this.logService.error(error);
						});

					 // Update Device Info

					let userDevice = new UserDeviceInfo(this.userId, this.deviceId);

					this.userDeviceService.update(userDevice).subscribe(
						data => {
							this.logService.debug('WebsocketService: Received updateDeviceInfo response', data);
							},
						error => {
							this.logService.error(error);
						});


					// Start heartbeat timer

					this.heartBeatTimer = setInterval(() => {
						let jsonMsg = {type: "heartbeat", event: "ping"};
     					let jsonStr = JSON.stringify(jsonMsg);
     					if (ws.readyState === WebSocket.OPEN) {
							this.logService.debug('WebsocketService: Sending Heartbeat Message', jsonStr);
							ws.send(jsonStr);
						}
       				}, 10000);	
					

			
					// Publish On Opened Event
					obs.next(event);
				}
				ws.onmessage = (event: MessageEvent) => {
					this.logService.info('WebsocketService: Message Received');
					obs.next(event);
				};
				ws.onerror = (event: ErrorEvent) => {
					this.logService.error('WebsocketService: Some Error in Websocket Connection', event);

					if (this.heartBeatTimer) {
						clearInterval(this.heartBeatTimer);
						this.heartBeatTimer = null;
					}
					
					this.socket = null;

					obs.error(event);
				};
				ws.onclose = (event: CloseEvent) => {
					this.logService.info('WebsocketService: Connection Closed');

					if (this.heartBeatTimer) {
						clearInterval(this.heartBeatTimer);
						this.heartBeatTimer = null;
					}

					this.socket = null;

					obs.complete();
				};

				return () => {
					this.logService.debug('WebsocketService: Subscription disposed');
					//ws.close();
				}
			});

		let observer = {
			next: (data: Object) => {
				this.logService.info("WebsocketService: Message to be sent", JSON.stringify(data));
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(JSON.stringify(data));
				}
			},
			complete: () => {
				this.logService.info("WebsocketService: Closing Web Socket Connection");
				ws.close();
			} 
		};

		return Subject.create(observer, observable);
	}

	

} // end class WebSocketService