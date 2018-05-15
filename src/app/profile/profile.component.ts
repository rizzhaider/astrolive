import { LogService } from 'ng2-log-service';
import { AstroDetails } from './../shared/models/astro-details.model';
import { AstroProfile } from './../shared/models/astro-profile.model';
import { WebSocketService } from './../shared/services/websocket.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserProfileService } from './../shared/services/user-profile.service';
import { UserService } from './../shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [LogService]
})
export class ProfileComponent implements AfterViewInit, OnInit {
  public sidebarCollapsed: boolean = false;
  public userId: string;

  private connectionSubscription: Subscription;
  private connectionObserver: Subject<any>;
  public callEvent: any;
  public loading: boolean;
  public profile: AstroProfile = new AstroProfile();
  public contactEditMode: boolean;
  @ViewChild('showInstructions') _showInstructions: any;

  constructor(private userProfileService: UserProfileService,
    private userService: UserService,
    private connectionService: WebSocketService,
    private logService: LogService) { 
      this.logService.namespace = 'ProfileComponent';
    }

  ngOnInit() {
    this.loading = true;
    this.contactEditMode = false;
    this.connect();
    this.getAstroProfile();
  }

   ngAfterViewInit() {
     if (this.userService.getInstructionsDisplayStatus() === "false") {
          this._showInstructions.openModal();
          this.userService.saveInstructionsDisplayStatus("true");
     }
  }

  toggleEditMode() {
    this.  contactEditMode = true;
  }
  EditModeCancel() {
    this.contactEditMode = false;
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

  getAstroProfile() {
    this.userProfileService.getAstroProfile(this.userService.getUser()).subscribe(
      data => {
        this.logService.debug('Received getAstroProfile response', data);
        this.profile = data;
         this.loading = false;
        let details = new AstroDetails();
        details.name = this.profile.name;
        details.imgUrl = this.profile.imgUrl;
        this.userService.saveUserDetails(details); 
      },
      error => {
        this.logService.error(error);
        this.loading = false;
      });
  }

  sidebarButtonToggled(toggled: boolean) {
    this.sidebarCollapsed = toggled;
    
  }


 
}
