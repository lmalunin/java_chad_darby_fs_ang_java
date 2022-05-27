import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from '../../common/country';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { State } from '../../common/state';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators';

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

    constructor(private _formByilder: FormBuilder, private _luv2ShopFormService: Luv2ShopFormService,
                private _cartService: CartService, private _checkoutService: CheckoutService,
                private _router: Router) {
    }

    get firstName() {
        return this.checkoutFormGroup.get('customer.firstName');
    }

    get lastName() {
        return this.checkoutFormGroup.get('customer.lastName');
    }

    get email() {
        return this.checkoutFormGroup.get('customer.email');
    }

    /**
     * Shipping Address
     **/
    get shippingAddressStreet() {
        return this.checkoutFormGroup.get('shippingAddress.street');
    }

    get shippingAddressCity() {
        return this.checkoutFormGroup.get('shippingAddress.city');
    }

    get shippingAddressState() {
        return this.checkoutFormGroup.get('shippingAddress.state');
    }

    get shippingAddressZipCode() {
        return this.checkoutFormGroup.get('shippingAddress.zipCode');
    }

    get shippingAddressCountry() {
        return this.checkoutFormGroup.get('shippingAddress.country');
    }

    /**
     * Billing Address
     **/
    get billingAddressStreet() {
        return this.checkoutFormGroup.get('billingAddress.street');
    }

    get billingAddressCity() {
        return this.checkoutFormGroup.get('billingAddress.city');
    }

    get billingAddressState() {
        return this.checkoutFormGroup.get('billingAddress.state');
    }

    get billingAddressZipCode() {
        return this.checkoutFormGroup.get('billingAddress.zipCode');
    }

    get billingAddressCountry() {
        return this.checkoutFormGroup.get('billingAddress.country');
    }

    /**
     * Credit Card
     **/
    get creditCardType() {
        return this.checkoutFormGroup.get('creditCard.cardType');
    }

    get creditCardNameOnCard() {
        return this.checkoutFormGroup.get('creditCard.nameOnCard');
    }

    get creditCardNumber() {
        return this.checkoutFormGroup.get('creditCard.cardNumber');
    }

    get creditCardSecurityCode() {
        return this.checkoutFormGroup.get('creditCard.securityCode');
    }

    ngOnInit(): void {

        this.reviewCartDetails();

        this.checkoutFormGroup = this._formByilder.group({
            customer: this._formByilder.group({
                firstName: new FormControl('',
                    [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
                lastName: new FormControl('',
                    [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
                email: new FormControl('',
                    [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Luv2ShopValidators.notOnlyWhiteSpace]),
            }),
            shippingAddress: this._formByilder.group({
                street: new FormControl('',
                    [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
                city: new FormControl('',
                    [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
                state: new FormControl('',
                    [Validators.required]),
                country: new FormControl('',
                    [Validators.required]),
                zipCode: new FormControl('',
                    [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
            }),
            billingAddress: this._formByilder.group({
                street: new FormControl('',
                    [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
                city: new FormControl('',
                    [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
                state: new FormControl('',
                    [Validators.required]),
                country: new FormControl('',
                    [Validators.required]),
                zipCode: new FormControl('',
                    [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
            }),
            creditCard: this._formByilder.group({
                cardType: new FormControl('',
                    [Validators.required]),
                nameOnCard: new FormControl('',
                    [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
                cardNumber: new FormControl('',
                    [Validators.required, Validators.pattern('[0-9]{16}')]),
                securityCode: new FormControl('',
                    [Validators.required, Validators.pattern('[0-9]{3}')]),
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

        if (this.checkoutFormGroup.invalid) {
            this.checkoutFormGroup.markAllAsTouched();
            return;
        }

        // set up order
        let order = new Order();
        order.totalPrice = this.totalPrice;
        order.totalQuantity = this.totalQuantity;

        // get cart items
        const cartItems = this._cartService.cartItems;

        // create orderItems from cartItems
        let orderItems: OrderItem[] = cartItems.map(value => new OrderItem(value));

        // set up purchase
        let purchase = new Purchase();

        // populate purchase - customer
        purchase.customer = this.checkoutFormGroup.controls['customer'].value;

        // populate purchase - shipping address
        purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
        const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
        const shippingCountry: State = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
        purchase.shippingAddress.state = shippingState.name;
        purchase.shippingAddress.country = shippingCountry.name;

        // populate purchase - billing address
        purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
        const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
        const billingCountry: State = JSON.parse(JSON.stringify(purchase.billingAddress.country));
        purchase.billingAddress.state = billingState.name;
        purchase.billingAddress.country = billingCountry.name;

        // populate purchase - order and orderItems
        purchase.order = order;
        purchase.orderItems = orderItems;

        // call REST API via the CheckoutService
        this._checkoutService.placeOrder(purchase)
            .subscribe(
                {
                    next: response => {
                        alert(`Your order has been received. \nOrder tracking number: ${response.orderTrackingNumber}`);

                        // reset cart
                        this.resetCart();
                    },
                    error: err => {
                        alert(`There was an error: ${err.message}`);
                    }
                }
            )
    }

    copyShippingAddressToBillingAddress(event: any) {
        if (event.target.checked) {
            this.checkoutFormGroup.controls['billingAddress']
                .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

            this.billingAddressStates = [...this.shippingAddressStates];
        } else {
            this.checkoutFormGroup.controls['billingAddress'].reset();
            this.billingAddressStates = [];
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

                formGroup.get('state').setValue(value[0]);
            });
    }

    chanageTest(firstName: AbstractControl) {
        console.log(firstName);
    }

    private reviewCartDetails() {
        this._cartService.totalQuantity$.subscribe(value => this.totalQuantity = value);
        this._cartService.totalPrice$.subscribe(value => this.totalPrice = value);
    }

    private resetCart() {

        // reset cart data
        this._cartService.cartItems = [];
        this._cartService.totalPrice$.next(0);
        this._cartService.totalQuantity$.next(0);

        // reset the form
        this.checkoutFormGroup.reset();

        // navigate back to the products page
        this._router.navigateByUrl('/products');
    }
}
