import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from '../../common/country';
import { State } from '../../common/state';
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

    countries: Country[] = [];

    shippingAddressStates: State[] = [];
    billingAddressStates: State[] = [];

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
            });

        this._luv2ShopFormService.getCreditCardYears()
            .subscribe(value => {
                console.log('Retrieved credit card years: ' + JSON.stringify(value));
                this.creditCardYears = value;
            });

        this._luv2ShopFormService.getCountries()
            .subscribe(
                value => this.countries = value
            );
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

    handleMonthsAndYears() {
        const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
        const currentYear: number = new Date().getFullYear();
        const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

        let startMonth: number;
        if (currentYear === selectedYear) {
            startMonth = new Date().getMonth() + 1;
        } else {
            startMonth = 1;
        }

        this._luv2ShopFormService.getCreditCardMonths(startMonth)
            .subscribe(value => this.creditCardMonths = value);
    }

    getStates(formGroupName: string) {

        const formGroup = this.checkoutFormGroup.get(formGroupName);
        const countryCode = formGroup?.value.country.code;
        const countryName = formGroup?.value.country.name;

        this._luv2ShopFormService.getStates(countryCode)
            .subscribe(value => {
                if (formGroupName === 'shippingAddress') {
                    this.shippingAddressStates = value;
                } else if (formGroupName === 'billingAddress') {
                    this.billingAddressStates = value;
                }
            });
    }
}
