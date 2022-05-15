import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    checkoutFormGroup: FormGroup;

    constructor(private _formByilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.checkoutFormGroup = this._formByilder.group({
            customer: this._formByilder.group({
                firstName: [''],
                lastName: [''],
                email: ['']
            })
        })
    }

    onSubmit() {
        console.log(this.checkoutFormGroup.get('customer')?.value);
    }
}
