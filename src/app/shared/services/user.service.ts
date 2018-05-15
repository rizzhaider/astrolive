import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AstroDetails } from './../models/astro-details.model';

export class UserService {
    
    private subject = new Subject<AstroDetails>();
    private presenceSubject = new Subject<string>();
    saveUser(id: string): void {
        localStorage.setItem('currentUserId', id);
    }

    clearUser(): void {
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserDetails');
        localStorage.removeItem('currentDNDStatus');
        localStorage.removeItem('instructionsDisplayStatus');
        
    }

    getUser(): string {
        return localStorage.getItem('currentUserId');
    }

    saveUserDetails(details: AstroDetails) {
        localStorage.setItem('currentUserDetails', JSON.stringify(details));
        this.subject.next(details);
    }

    getUserDetails(): AstroDetails {
        return JSON.parse(localStorage.getItem('currentUserDetails'));

    }

    getPresenceStatus(): string {
        return localStorage.getItem('presenceStatus');
    }

    savePresenceStatus(status: string): void {
        localStorage.setItem('presenceStatus', status);
        this.presenceSubject.next(status);
    }

    getInstructionsDisplayStatus(): string {
        return localStorage.getItem('instructionsDisplayStatus');
    }

    saveInstructionsDisplayStatus(status: string): void {
        localStorage.setItem('instructionsDisplayStatus', status);
    }


    getUserDetailsSubscription(): Observable<AstroDetails> {
        return this.subject.asObservable();

    }

    getPresenceDetailsSubscription(): Observable<string> {
        return this.presenceSubject.asObservable();

    }

}