import { ProfileComponent } from './../../profile/profile.component';
import { UserService } from './../services/user.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (route && route.routeConfig.path == 'login') {
            if (this.userService.getUser()) {
                // logged in redirect to ProfileComponent
                this.router.navigate(['/']/*, { queryParams: { returnUrl: state.url }}*/);
                return false;
            } else {
                return true;
            }
        } else if (route) {
            if (this.userService.getUser()) {
                // logged in so return true
                return true;
            } else {
                // not logged in so redirect to login page with the return url
                this.router.navigate(['/login']/*, { queryParams: { returnUrl: state.url }}*/);
                return false;

            }
        }    
    }
}    