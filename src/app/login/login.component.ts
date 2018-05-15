import { LogService } from 'ng2-log-service';
import { AlertService } from './../shared/services/alert.service';
import { AuthenticationService } from './../shared/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AlertService, LogService]
})
export class LoginComponent implements OnInit {
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService, 
        private logService: LogService) {
            this.logService.namespace = 'LoginComponent';
         }
        
    ngOnInit() {
    }

    login(form: NgForm) {
        
        const _username = form.value.username;
        const _password = form.value.password;

        this.authenticationService.login(_username, _password)
            .subscribe(
                data => {
                    this.logService.debug('Received login response', data);
                    if (data.success) {
                        this.router.navigate(['profile']);
                    } else {
                        this.alertService.error(data.errorMsg);
                    }
                },
                error => {
                      this.alertService.error('Server Error');
                      this.logService.error(error);
                });
    }
}
