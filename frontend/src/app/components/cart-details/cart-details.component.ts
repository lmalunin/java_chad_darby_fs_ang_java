import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-cart-details',
    templateUrl: './cart-details.component.html',
    styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

    cartItems: CartItem[] = [];
    totalPrice: number = 0;
    totalQuantity: number = 0;

    constructor(private _cartService: CartService) {
    }

    ngOnInit(): void {
        this.listCartDetails();
    }

    private listCartDetails() {
        this.cartItems = this._cartService.cartItems;
        this._cartService.totalPrice$.subscribe(value => this.totalPrice = value);
        this._cartService.totalQuantity$.subscribe(value => this.totalQuantity = value);

        this._cartService.computeCartTotals();
    }
}
