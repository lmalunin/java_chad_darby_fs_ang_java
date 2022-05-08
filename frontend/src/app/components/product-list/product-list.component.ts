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

  products: Product[];
  currentCategoryId: number;
  currentCategoryName: string;

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(_ => {
      this.listProducts();
    })
  }

  listProducts() {
    const hasCategoryId: boolean = this.activatedRoute.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId = +this.activatedRoute.snapshot.paramMap.get('id');
      this.currentCategoryName = this.activatedRoute.snapshot.paramMap.get('name');
    }else{
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}
