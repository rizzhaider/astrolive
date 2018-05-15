import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import { WebSocketService } from './../shared/services/websocket.service';
import { AuthenticationService } from './../shared/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  public sidebarCollapsed: boolean = false;
  private connectionSubscription: Subscription;
  private connectionObserver: Subject<any>;
  public callEvent: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private connectionService: WebSocketService
  ) { }


  ngOnInit() {
    this.connectionObserver = this.connectionService.connect();
    this.connectionSubscription = this.connectionObserver.subscribe(
      (event) => { 
        if (event.type == 'open') {
            console.log('Connection Opened');
        } else if (event.type == 'message'){ 
            console.log('Message Received ' + event.data);
            this.callEvent = event.data;
        }
     },
      (error) => { console.log('error ' + error) },
      () => { console.log('The socket connection is closed'); }
    );
}

  ngOnDestroy() {
    this.connectionSubscription.unsubscribe();
  }

  // onLogout() {
  //   this.authenticationService.logout();
  //   this.router.navigate(['login']);
  // }

  sidebarButtonToggled(toggled: boolean) {
    this.sidebarCollapsed = toggled;
  }

  onNewCallOutEvent(eventData: any) {
    //console.log(JSON.stringify(eventData));
    this.connectionObserver.next(eventData);
  }

}
