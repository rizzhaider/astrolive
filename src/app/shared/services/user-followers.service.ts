import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class UserFollowersService {
    constructor(private http: Http) { }

    private baseURL = environment.baseRESTURI;
    
    private followerURL = this.baseURL + '/astrofollowlist';
    private followerProfileURL = this.baseURL + '/getUserProfile';

    getAstroFollower(userid: string, start: number, count: number) {
        let _followerurl = this.followerURL;
        _followerurl = _followerurl + '?astroid=' + userid + '&start_count=' + start + '&limit=' + count;

    return this.http.get(_followerurl)
            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    }

    getAstroFollowerProfile(userid: string) {
        let _followerprofileurl = this.followerProfileURL;
        _followerprofileurl = _followerprofileurl + '?id=' + userid;


      
        return this.http.get(_followerprofileurl)
            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    }

}