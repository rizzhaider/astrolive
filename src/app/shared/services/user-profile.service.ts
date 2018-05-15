import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class UserProfileService {
    constructor(private http: Http) { }

    private baseURL = environment.baseRESTURI;

    private profileURL = this.baseURL + '/getAstroProfile';
    private getExpertiseURL = this.baseURL + '/videoChat/categoryList';
    private getLanguagesURL = this.baseURL + '/languagelist';
    private updateProfileURL = this.baseURL + '/userSignUp';



    getAstroProfile(userid: string) {
        let _profileURL = this.profileURL;
        _profileURL = _profileURL + '?id=' + userid;
        return this.http.get(_profileURL)
            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getExpertiseList() {
        return this.http.get(this.getExpertiseURL)
            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getLanguageList() {
        return this.http.get(this.getLanguagesURL)
            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    updateAstroProfile(profileObject: any) {
        let headers = new Headers({ 'cache-control': 'no-cache' });
        const formData = new FormData();
        formData.append('status', '');
        formData.append('firstName', profileObject.firstName);
        formData.append('user_type', profileObject.userType);
        formData.append('expertise', profileObject.expertise);
        formData.append('experience', profileObject.experience);
        formData.append('description', profileObject.description);
        formData.append('userId', profileObject.userId);
        formData.append('lang', profileObject.languages);
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(this.updateProfileURL, formData, options)
            .map((response: Response) => {
                let data = response.json();
                return data;
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

}