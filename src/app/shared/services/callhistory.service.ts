import { DatePipe } from '@angular/common';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Tip } from '../models/user-tip';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class CallHistoryService {
    constructor(private http: Http, 
    private datePipe: DatePipe) { }

    private baseURL = environment.baseRESTURI;

    private getHistoryURL = this.baseURL + '/astroMis';
    
   
    getCallHistory(userid: string) {
        let _gethistoryurl = this.getHistoryURL;
        let today = new Date();
        let fromDate = this.datePipe.transform(today, 'yyyy-MM-dd');
        let toDate = this.datePipe.transform(today, 'yyyy-MM-dd');
        
        _gethistoryurl = _gethistoryurl + '?fromDate=' + fromDate + '&toDate=' + toDate +  '&astroList=' + userid + '&start=0&length=1000&type=M'; 
        return this.http.get(_gethistoryurl)

            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    }

}


