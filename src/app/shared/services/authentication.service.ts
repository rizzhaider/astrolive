import { LogService } from 'ng2-log-service';
import { environment } from './../../../environments/environment';
import { UserPresenceService } from './user-presence.service';
import { WebSocketService } from './websocket.service';
import { UserService } from './user.service';
import { PresenceStatus } from '../enums/presence-status.enum';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class AuthenticationService {
    constructor(private http: Http,
        private userService: UserService,
        private connectionService: WebSocketService,
        private presenceService: UserPresenceService, 
        private logService: LogService) { 
        }

        private baseURL = environment.baseRESTURI;
        private loginUrl = this.baseURL + '/videoChat/loginRequest';

    login(username: string, password: string) {
        
        let authObjectData = {
            userName : username,
            password: password,
            type: 1
        };
        let authObject = {Data: authObjectData};
        
        
        return this.http.post(this.loginUrl, JSON.stringify(authObject))
            .map((response: Response) => {
               let data = response.json();
               if (data) {
                   if (data.success) {
                       this.userService.saveUser(data.userId);
                       this.userService.saveInstructionsDisplayStatus("false");
                    } 
               }
               return data;
            }).catch((error:any) => Observable.throw(error.json().error || 'Server error'));
            
            
    }

    logout(date: string, time: string) {
        

        // Set status as offline
        
        let userId = this.userService.getUser();
        let status = PresenceStatus.OFFLINE.toString();
        
        this.logService.info('AuthenticationService: Setting Astro Presence as Offline');

       
        this.presenceService.updatePresenceWithParams(userId, status, date, time).subscribe(
            data => {
                this.logService.debug('AuthenticationService: Received updatePresence Response', data);
            },
            error => {
                this.logService.error(error);
            });

    // remove user from local storage to log user out

        this.logService.info('AuthenticationService: Removing Astro from local storage');
        this.userService.clearUser();
        this.logService.info('AuthenticationService: Closing Websocket Connection');
        this.connectionService.getConnection().complete();

    }
}