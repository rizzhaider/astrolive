import { LogService } from 'ng2-log-service';
import { WebSocketService } from './../shared/services/websocket.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { FollowerProfile } from './../shared/models/follower-profile.model';
import { Follower } from './../shared/models/follower.model';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { UserFollowersService } from './../shared/services/user-followers.service';
import { UserService } from './../shared/services/user.service';

@Component({
	selector: 'app-followers',
	templateUrl: './followers.component.html',
	styleUrls: ['./followers.component.css'],
	providers: [LogService]
})
export class FollowersComponent implements OnInit, OnDestroy {
	public sidebarCollapsed: boolean = false;
	public userId: string;
	public followersList: Follower[] = [];
	public selectedProfile: FollowerProfile;

	private connectionSubscription: Subscription;
	private connectionObserver: Subject<any>;
	public callEvent: any;
	public loading: boolean;
	public selectedFollower: Follower;
	private start: number;
  	private count: number;
  	private listCompleted: boolean;


	constructor(private userFollowersService: UserFollowersService,
		private userService: UserService,
		private connectionService: WebSocketService,
		private logService: LogService) {
		this.logService.namespace = 'FollowersComponent';
	}

	ngOnInit() {
		this.loading = true;
		this.start = 0;
    	this.count = 10;
    	this.listCompleted = false;
		this.connect();
		this.getAstroFollowers(this.start, this.count);
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
					this.logService.info('Message Received', event.data);
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

	getAstroFollowers(start: number, count: number) {
		if (!this.listCompleted) {
			this.userFollowersService.getAstroFollower(this.userService.getUser(), start, count).subscribe(
				data => {
					this.logService.debug('Received getAstroFollower Response', data);
					if (data.followers.length > 0) {
						if (this.followersList.length == 0) {
							this.followersList = data.followers;
							if (this.followersList && this.followersList.length > 0) {
								this.getFollowerProfile(this.followersList[0].id);
								this.selectedFollower = this.followersList[0];
								this.selectedFollower.isActive = true;
							}
						} else {
							this.followersList.push.apply(this.followersList, data.followers);
						}
						this.start = this.followersList.length;
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

	getFollowerProfile(id: string) {
		this.userFollowersService.getAstroFollowerProfile(id).subscribe(
			data => {
				this.logService.debug('Received getFollowerProfile Response', data);
				this.selectedProfile = data;
			},
			error => {
				this.logService.error(error);
			});

	}

	onFollowerSelected(follower: Follower) {
		this.getFollowerProfile(follower.id);
		if (this.selectedFollower) {
			this.selectedFollower.isActive = false;
		}
		this.selectedFollower = follower;




	}

	onScrolledDown() {
    	this.getAstroFollowers(this.start, this.count);
  	}

}


