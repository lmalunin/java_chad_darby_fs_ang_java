import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list-grid.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

    products: Product[];
    currentCategoryId: number;
    currentCategoryName: string;
    searchMode: boolean;

    constructor(private productService: ProductService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(_ => {
            this.listProducts();
        })
    }

    listProducts() {
        this.searchMode = this.activatedRoute.snapshot.paramMap.has('keyword')
        if (this.searchMode) {
            this.handleSearchProducts();
        } else {
            this.handleListProducts()
        }
    }

    handleListProducts() {
        const hasCategoryId: boolean = this.activatedRoute.snapshot.paramMap.has('id');

        if (hasCategoryId) {
            this.currentCategoryId = +this.activatedRoute.snapshot.paramMap.get('id');
            this.currentCategoryName = this.activatedRoute.snapshot.paramMap.get('name');
        } else {
            this.currentCategoryId = 1;
            this.currentCategoryName = 'Books';
        }

        this.productService.getProductList(this.currentCategoryId).subscribe(
            data => {
                this.products = data;
            }
        )
    }

    private handleSearchProducts() {
        const theKeyword: string = this.activatedRoute.snapshot.paramMap.get('keyword');
        this.productService.searchProducts(theKeyword).subscribe(
            data => {
                this.products = data;
            }
        );
    }
}
