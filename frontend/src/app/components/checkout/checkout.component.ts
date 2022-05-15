import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    checkoutFormGroup: FormGroup;

    totalPrice: number = 0;
    totalQuantity: number = 0;

    constructor(private _formByilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.checkoutFormGroup = this._formByilder.group({
            customer: this._formByilder.group({
                firstName: [''],
                lastName: [''],
                email: ['']
            }),
            shippingAddress: this._formByilder.group({
                street: [''],
                city: [''],
                state: [''],
                country: [''],
                zipCode: [''],
            }),
            billingAddress: this._formByilder.group({
                street: [''],
                city: [''],
                state: [''],
                country: [''],
                zipCode: [''],
            }),
            creditCard: this._formByilder.group({
                cardType: [''],
                nameOnCard: [''],
                cardNumber: [''],
                securityCode: [''],
                expirationMonth: [''],
                expirationYear: [''],
            }),
        })
    }

    onSubmit() {
        console.log(this.checkoutFormGroup.get('customer')?.value);
    }

    copyShippingAddressToBillingAddress(event: any) {
        if (event.target.checked) {
            this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
        } else {
            this.checkoutFormGroup.controls['billingAddress'].reset();
        }
    }
}
