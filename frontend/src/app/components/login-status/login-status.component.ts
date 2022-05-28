import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
    selector: 'app-login-status',
    templateUrl: './login-status.component.html',
    styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

    isAuthenticated: boolean | undefined = false;
    userFullName: string;

    constructor(private _oktaAuthStateService: OktaAuthStateService, @Inject(OKTA_AUTH) public _oktaAuth: OktaAuth) {
    }

    ngOnInit(): void {
        this._oktaAuthStateService.authState$
            .subscribe(result => {
                this.isAuthenticated = result.isAuthenticated;
                this.getUserDetails();
            })
    }

    logout() {
        this._oktaAuth.signOut();
    }

    private getUserDetails() {
        if (this.isAuthenticated) {
            this._oktaAuth.getUser().then(
                (res) => {
                    this.userFullName = res.name;
                }
            )
        }
    }
}
