import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

declare var Fingerprint2: any;

export class UserWebDeviceService {
    
    constructor() {
        new Fingerprint2().get((result, components) => {
  				this.saveDevice('web' + result);
        });
    }

    getDevice(): string {
        if (localStorage.getItem('uniqueDeviceId')) {
            return localStorage.getItem('uniqueDeviceId');
        } else {
            return 'web' + (new Date()).getTime().toString();
        }
    }

    saveDevice(id: string): void {
        localStorage.setItem('uniqueDeviceId', id);
    }

    clearDevice(): void {
        localStorage.removeItem('uniqueDeviceId');
    }
}