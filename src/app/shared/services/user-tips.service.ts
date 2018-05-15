import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Tip } from '../models/user-tip';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class UserTipsService {
    constructor(private http: Http) { }

    private baseURL = environment.baseRESTURI;

    private getTipsURL = this.baseURL + '/astroTips';
    private addTipsURL = this.baseURL + '/editAstroTips/add';
    private deleteTipsURL = this.baseURL + '/editAstroTips/delete';
    private editTipsURL = this.baseURL + '/editAstroTips/edit';
    
   
    getAstroTips(userid: string) {
        let _gettipurl = this.getTipsURL;
        _gettipurl = _gettipurl + '?astroId=' + userid + '&stt=0&cnt=20'; 
        return this.http.get(_gettipurl)

            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    }

    addAstroTip(userid: string, tip: string) {
        let tipObject = {
            astroId: userid,
            tips: tip,
            id: null
        };

        let headers = new Headers({ 'Content-Type': '    application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.addTipsURL, JSON.stringify(tipObject), options)
            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    }


    deleteAstroTip(_userid: string, _id: string) {

        let tipObject = {
            astroId: _userid,
            tips: "",
            id: _id
        };


        let headers = new Headers({ 'Content-Type': '    application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.deleteTipsURL, JSON.stringify(tipObject), options)
            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    }

    editAstroTip(_tip: string, _id: string) {

        let tipObject = {
            astroId: "",
            tips: _tip,
            id: _id
        };


        let headers = new Headers({ 'Content-Type': '    application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.editTipsURL, JSON.stringify(tipObject), options)
            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

}


