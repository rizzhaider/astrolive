import { UserService } from './user.service';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class UserPresenceService {
    constructor(private http: Http,
    private userService: UserService) { }

    private baseURL = environment.baseRESTURI;
    private presenceURL = this.baseURL + '/astroAvailability';

    updatePresence(userid: string, status: string) {
        let _presenceURL = this.presenceURL;
        _presenceURL = _presenceURL + '?astroId=' + userid;
        _presenceURL = _presenceURL + '&status=' + status;

  
        return this.http.get(_presenceURL)
            .map((response: Response) => {
                this.userService.savePresenceStatus(status); // Save status locally
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    }

    updatePresenceWithParams(userid: string, status: string, date: string, time: string) {
        let _presenceURL = this.presenceURL;
        _presenceURL = _presenceURL + '?astroId=' + userid;
        _presenceURL = _presenceURL + '&status=' + status;
        _presenceURL = _presenceURL + '&date=' + date;
        _presenceURL = _presenceURL + '&time=' + time;

  
        return this.http.get(_presenceURL)
            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    }

}