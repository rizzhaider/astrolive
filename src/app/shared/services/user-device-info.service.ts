import { environment } from './../../../environments/environment';
import { UserDeviceInfo } from './../models/user-device-info';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class UserDeviceInfoService {
    constructor(private http: Http) { }

    private baseURL = environment.baseRESTURI;
    private userDeviceURL = this.baseURL + '/astroDeviceInfo';

    update(device: UserDeviceInfo) {

        return this.http.post(this.userDeviceURL, device)
            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    }

}