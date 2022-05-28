import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-login-status',
    templateUrl: './login-status.component.html',
    styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

    isAuthenticated: boolean | undefined = false;
    userFullName: string;

    constructor(private _oktaAuthStateService: OktaAuthStateService) {
    }

    ngOnInit(): void {
        this._oktaAuthStateService.authState$
            .subscribe(result => {
                this.isAuthenticated = result.isAuthenticated;
                this.getUserDetails();
            })
    }

    logout() {
        this._oktaAuthStateService.signOut();
    }

    private getUserDetails() {
        if (this.isAuthenticated) {
            this._oktaAuthStateService.getUser().then(
                (res) => {
                    this.userFullName = res.name;
                }
            )
        }
    }
}
