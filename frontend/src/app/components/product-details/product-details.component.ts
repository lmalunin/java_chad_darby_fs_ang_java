import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { Product } from '../../common/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

    product: Product;

    constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private _cartService: CartService) {
    }

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe(() => {
            this.handleProductDetails();
        });
    }

    addToCart() {
        console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);

        const theCartItem = new CartItem(this.product);

        this._cartService.addToCart(theCartItem);
    }

    private handleProductDetails() {
        const theProductId: number = +this.activatedRoute.snapshot.paramMap.get('id');

        this.productService.getProduct(theProductId)
            .subscribe(data => {
                this.product = data;
            })
    }
}
