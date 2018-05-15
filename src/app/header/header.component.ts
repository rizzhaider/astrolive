import { WebSocketService } from './../shared/services/websocket.service';
import { LogService } from 'ng2-log-service';
import { UserPresenceService } from './../shared/services/user-presence.service';
import { AstroDetails } from './../shared/models/astro-details.model';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from './../shared/services/user.service';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthenticationService } from './../shared/services/authentication.service';
import { Router } from '@angular/router';
import { PresenceStatus } from '../shared/enums/presence-status.enum';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [LogService]
})
export class HeaderComponent implements OnInit, OnDestroy {
  public sidebarCollapsed: boolean = false;
  public DNDStatus: boolean; 
  subscription: Subscription;
  presenceSubscription: Subscription;
  astroDetails: AstroDetails;
  presenceStatus: string;
  presenceIconTooltip: string;

  @Output() sidebarButtonToggled = new EventEmitter<boolean>();

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private presenceService: UserPresenceService,
    private logService: LogService) {
    // subscribe to User Details
    this.astroDetails = this.userService.getUserDetails();
    this.presenceStatus = this.userService.getPresenceStatus();
    this.presenceIconTooltip = this.getTooltip(this.presenceStatus);
    this.DNDStatus = this.userService.getPresenceStatus() === PresenceStatus.AWAY.toString();
    this.subscription = this.userService.getUserDetailsSubscription().subscribe(details => { this.astroDetails = details; }); 
    this.presenceSubscription = this.userService.getPresenceDetailsSubscription().subscribe(data => { 
        this.presenceStatus = data;
        this.presenceIconTooltip = this.getTooltip(this.presenceStatus);
        this.DNDStatus = this.presenceStatus === PresenceStatus.AWAY.toString(); 
    });    
  }

  ngOnInit() {
    this.sidebarCollapsed = false;
    // this.presenceStatus = this.connectionService.getConnectionStatus();
    // this.presenceSubscription = this.connectionService.getConnection().subscribe((event) => {
		// 		if (event.type == 'open') {
		// 			this.logService.info('header: Connection Opened');
		// 			this.presenceStatus = 'online';
		// 		} 
		// 	},
		// 	(error) => {
    //     this.logService.error('Header ' + error);
    //     this.presenceStatus = 'offline';
		// 		},
		// 	() => {
		// 		this.logService.info('Header: The socket connection is closed');
		// 		this.presenceStatus = 'offline';
		// 	})
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  onToggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.sidebarButtonToggled.emit(this.sidebarCollapsed);

  }

  // onLogout() {
  //   this.authenticationService.logout();
  //   this.router.navigate(['login']);
  // }
 
  onChange(event: Event) {
      this.logService.info('DND status is ', event);
      let userId = this.userService.getUser();
      let status;
      if (event) {
          status = PresenceStatus.AWAY.toString();
      } else {
          status = PresenceStatus.ONLINE.toString();
      }

      this.presenceService.updatePresence(userId, status).subscribe(
          data => {
              this.logService.info('Received updatePresence response', data);
          },
          error => {
              this.logService.error(error);
              if (event) {
                  this.DNDStatus = false;
              } else {
                  this.DNDStatus = true;
              }
          });
  }

  private getTooltip(status: string): string {
      if (status === '0') {
          return 'Offline'
      } else if (status === '1') {
          return 'Online'
      } else if (status === '2') {
          return 'Busy'
      } else if (status === '3') {
          return 'DND'
      }
      return ''; 
  }

}
