import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
    selector: 'app-login-status',
    templateUrl: './login-status.component.html',
    styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

    isAuthenticated: boolean | undefined = false;
    userFullName: string;

    constructor(private _oktaAuthService: OktaAuthService) {
    }

    ngOnInit(): void {
        this._oktaAuthStateService.authState$
            .subscribe(result => {
                this.isAuthenticated = result.isAuthenticated;
                this.getUserDetails();
            })
    }

    logout() {
        this._oktaAuthService.signOut();
    }

    private getUserDetails() {
        if (this.isAuthenticated) {
            this._oktaAuthService.getUser().then(
                (res) => {
                    this.userFullName = res.name;
                }
            )
        }
    }
}
