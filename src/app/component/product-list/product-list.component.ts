import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs';
import { ApiService } from 'src/app/services/api-service.service';
import { CartService } from 'src/app/services/cart-service.service';
import { LoginManager } from 'src/app/services/login.service';
import { StorageService } from 'src/app/services/storage-service.service';
import { ToastService } from 'src/app/services/toast-service.service';
import { ProductListService } from 'src/app/services';
import { CartComponent } from '../cart/cart.component';
import { Product } from 'src/model/product';
import { NgForm, NgModel } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  providers: [ApiService, CartService, StorageService, LoginManager, ToastService, CartComponent],
})
export class ProductListComponent implements OnInit, OnDestroy {
  private _alive: boolean = true;
  productList: Product[] = this.products_list.getAllProducts();
  prodLis: Product[] = this.products_list.getAllProducts();
  
  filterpopup = false || window.matchMedia('(min-width: 992px)').matches;
  filterpopback = this.filterpopup && window.matchMedia('(max-width: 991px)').matches;
  toogle() {
    this.filterpopback = !this.filterpopback
    this.filterpopup = !this.filterpopup || window.matchMedia('(min-width: 992px)').matches;
  }
  /*Sort Methods and current Sorting Method*/
  currentSortMethod: string = "Sort: Default"; //initial sort method is rating
  SortMethods: string[] = [
    "Sort: Default",
    "Price: Low to High",
    "Price: High to Low"
  ];
  sort() {
    if (this.currentSortMethod == "Price: Low to High") this.productList.sort((a, b) => a.mrp - b.mrp)
    else if (this.currentSortMethod == "Price: High to Low") this.productList.sort((a, b) => b.mrp - a.mrp)
    else if (this.currentSortMethod == "Sort: Default") this.productList.sort((a, b) => a.id - b.id)
  }

  /*currently showing products*/

  /*filters */
  changeCheckBrand(brandName: string, checkValue: any) {
    if (checkValue)
      this.checkedBrands.add(brandName)
    else
      this.checkedBrands.delete(brandName)
    this.filter()
  }

  checkedBrands: Set<string> = new Set;
  allBrands: any[] = [];


  //initiate filters 
  initFilters(all_products: any[]) {
    var allBrandsSet = new Set();
    all_products.forEach((element) => {
      allBrandsSet.add(element["brand"]);
    })
    this.allBrands = Array.from(allBrandsSet)
  }

  //filters all products based on curent filter data
  filter() {
    this.productList = [];
    this.prodLis.forEach((element) => {
      if (
        //brands check
        (!this.checkedBrands.size ||
          this.checkedBrands.has(element.brand))
      )
        this.productList.push(element);
    });
    this.sort();
    var filterObject = {
      brands: "",
    }

    if (1
    ) {
      filterObject.brands = JSON.stringify(Array.from(this.checkedBrands));
      sessionStorage.setItem("filters", JSON.stringify(filterObject));
    }
  }

  resetFilters(f: NgForm) {
    f.reset();
    this.checkedBrands = new Set;
    this.filter()
  }

  //confimrmation data
  removeProduct = {
    id: 0,
    name: ""
  }
  checkLocalStorageForFilters() {
    var prevFilter = sessionStorage.getItem("filters")
    if (prevFilter == null) {
      this.checkedBrands = new Set()
      return;
    }
    var filters = JSON.parse(prevFilter);
    this.checkedBrands = new Set(JSON.parse(filters.brands));
    for(let item of this.checkedBrands){
      var elm = $("#"+item);
      elm.click();
      
    }
    this.filter()
  }
  getvalue(){
    
    return false;
  }
  constructor(private _apiService: ApiService, public products_list: ProductListService) { }

  ngOnInit() {
    this.initFilters(this.prodLis);
    this.checkLocalStorageForFilters();
    this.filter();
    this.sort();
    this._apiService
    .getProducts()
    .pipe(takeWhile(() => this._alive))
    .subscribe((response) => (this.productList = response.body));
  }

  ngOnDestroy() {
    this._alive = false;
  }

}
