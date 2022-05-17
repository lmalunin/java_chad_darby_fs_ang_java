import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    checkoutFormGroup: FormGroup;

    totalPrice: number = 0;
    totalQuantity: number = 0;

    creditCardYears: number[] = [];
    creditCardMonths: number[] = [];

    constructor(private _formByilder: FormBuilder, private _luv2ShopFormService: Luv2ShopFormService) {
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

        const startMonth: number = new Date().getMonth() + 1;
        console.log('startMonth: ' + startMonth);

        this._luv2ShopFormService.getCreditCardMonths(startMonth)
            .subscribe(value => {
                console.log('Retrieved credit card months: ' + JSON.stringify(value));
                this.creditCardMonths = value;
            })

        this._luv2ShopFormService.getCreditCardYears()
            .subscribe(value => {
                console.log('Retrieved credit card years: ' + JSON.stringify(value));
                this.creditCardYears = value;
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
