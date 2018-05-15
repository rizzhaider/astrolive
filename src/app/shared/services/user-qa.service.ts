import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class UserQAService {
    constructor(private http: Http) { }
    
    private baseURL = environment.baseRESTURI;

    private getQAURL = this.baseURL + '/QAList';
    private addAnswerURL = this.baseURL + '/editQA';
    
    getQAList(start: number, count: number) {
        let _getQAURL = this.getQAURL;
        _getQAURL = _getQAURL + '?start_count=' + start + '&limit=' + count;
        return this.http.get(_getQAURL)
            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    addAnswer(answerData: any) {
        let headers = new Headers({ 'Content-Type': '    application/json' });
        let options = new RequestOptions({ headers: headers });
    
        return this.http.post(this.addAnswerURL, JSON.stringify(answerData), options)
            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}