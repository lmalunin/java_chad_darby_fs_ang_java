import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    cartItem: CartItem[] = [];
    totalPrice: Subject<number> = new Subject<number>();
    totalQuantity: Subject<number> = new Subject<number>();

    constructor() {
    }

    addToCart(theCartItem: CartItem) {
        let alreadyExistInCart: boolean = false;
        let existingCartItem: CartItem = undefined;

        if (this.cartItem.length > 0) {
            for (let tempCartItem of this.cartItem) {
                if (tempCartItem.id === theCartItem.id) {
                    existingCartItem = tempCartItem;
                    break;
                }
            }
            alreadyExistInCart = (existingCartItem != undefined);
        }

        if (alreadyExistInCart) {
            existingCartItem!.quantity++;
        } else {
            this.cartItem.push(theCartItem);
        }

        this.computeCartTotals();
    }

    private computeCartTotals() {

    }
}
