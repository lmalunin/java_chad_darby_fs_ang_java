import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list-grid.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

    products: Product[] = [];
    currentCategoryId: number = 1;
    previousCategoryId: number = 1;
    currentCategoryName: string = '';
    searchMode: boolean = false;

    // new properties for pagination
    thePageNumber: number = 1;
    thePageSize: number = 10;
    theTotalElements: number = 0;

    previousKeyword: string = '';

    constructor(private productService: ProductService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(_ => {
            this.listProducts(1);
        })
    }

    listProducts(page: number = 1) {
        this.searchMode = this.activatedRoute.snapshot.paramMap.has('keyword')
        if (this.searchMode) {
            this.handleSearchProducts(page);
        } else {
            this.handleListProducts(page)
        }
    }

    handleListProducts(page: number) {

        const hasCategoryId: boolean = this.activatedRoute.snapshot.paramMap.has('id');

        if (hasCategoryId) {
            this.currentCategoryId = +this.activatedRoute.snapshot.paramMap.get('id');
            this.currentCategoryName = this.activatedRoute.snapshot.paramMap.get('name');
        } else {
            this.currentCategoryId = 1;
            this.currentCategoryName = 'Books';
        }

        if (this.previousCategoryId != this.currentCategoryId) {
            this.thePageNumber = 1;
        }
        this.previousCategoryId = this.currentCategoryId;

        console.log(`currentCategoryId = ${this.currentCategoryId}, thePageNumber = ${page}`);

        this.productService.getProductListPaginate(page - 1, this.thePageSize, this.currentCategoryId)
            .subscribe(
                this.processResult()
            );
    }

    test(event: any) {
        console.log(event);
    }

    updatePageSize(eventPageSize: any) {
        this.thePageSize = eventPageSize.target.value;
        this.thePageNumber = 1;
        this.listProducts();
    }

    private handleSearchProducts(page: number) {
        const theKeyword: string = this.activatedRoute.snapshot.paramMap.get('keyword');

        if (this.previousKeyword != theKeyword) {
            this.thePageNumber = 1;
        } else {

        }

        this.previousKeyword = theKeyword;

        console.log(`theKeyword = ${theKeyword}, thePageNumber=${page} thePageSize=${this.thePageSize}`);

        this.productService.searchProductsPaginate(page - 1, this.thePageSize, theKeyword)
            .subscribe(
                this.processResult()
            );
    }

    private processResult() {
        return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; }) => {
            this.products = data._embedded.products;
            this.thePageNumber = data.page.number + 1;
            this.thePageSize = data.page.size;
            this.theTotalElements = data.page.totalElements;
        }
    }
}
