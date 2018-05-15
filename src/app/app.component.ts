import { PresenceStatus } from './shared/enums/presence-status.enum';
import { UserService } from './shared/services/user.service';
import { LogService } from 'ng2-log-service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private logService: LogService, private userService: UserService) {
    this.logService.namespace = 'Services';
    // Set Presence Status as Online first time
    if (this.userService.getPresenceStatus() === PresenceStatus.BUSY.toString()) {
        this.userService.savePresenceStatus(PresenceStatus.ONLINE.toString());
    } 
    
  }
  title = 'app works!';
}
