import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { tap, takeWhile, finalize } from "rxjs/operators";

import { Product } from "src/model/product";
import { ApiService, ToastService, CartService, LoginManager, UsersService, ProductListService } from "src/app/services";
import { NgForm } from "@angular/forms";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "product-detail",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"],
})
export class ProductComponent implements OnInit, OnDestroy {
  private _alive: boolean = true;

  productId: number;
  product: Product;
  quantity: number = 0;
  isProductFetched: boolean = false;
  presentquantity: number = 0;


  constructor(
    private _apiService: ApiService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _cartService: CartService,
    private _toastService: ToastService,
    private _loginService: LoginManager,
    private _userService: UsersService,
    private title: Title,
    private _products_list: ProductListService
  ) { }

  getQuantity() {
    return this._cartService.getQuantityOfEach(this._userService.getCurrentUserId(), this.productId);
  }
  addToCart(f: NgForm) {
    if (!this._loginService.checkSession()) return;
    this.quantity = f.value.quantity;
    f.reset();
    if (this.quantity < 1) {
      this._toastService.error("Quantity should be atleast one!");
      return;
    }

    const cartItems = this._cartService.getCartItems();
    if (cartItems.length) {
      const index = cartItems.findIndex((item) => item.id === this.productId);
      if (index !== -1) {
        cartItems[index].quantity += this.quantity;
        this.presentquantity = cartItems[index].quantity;
        this._cartService.setCartItems(cartItems);
        this._cartService.updateQuantity();
        this._toastService.success("Product added successfully!");

        return;
      }
    }
    // Adding in the cart if the product is not found in the cart
    cartItems.push({
      id: this.productId,
      quantity: this.quantity,

    } as Product);

    this._cartService.setCartItems(cartItems);
    this._cartService.updateQuantity();
    this._toastService.success("Product added successfully!");
    this.quantity = 1;
  }

  ngOnInit() {
    this.productId = +this._route.snapshot.params?.["id"];

    if (!this.productId) {
      this._toastService.error(
        "Product not found. Redirecting to list!"
      );
      this._router.navigateByUrl("/");
      return;
    }

    this.title.setTitle(this._products_list.getProduct(this.productId).name);
    this._apiService
      .getProducts()
      .pipe(
        tap((response) => {
          const products = response.body as Product[];
          const index = products.findIndex(
            (product) => product.id === this.productId
          );

          if (index >= 0) this.product = products[index];
        }),
        finalize(() => (this.isProductFetched = true)),
        takeWhile(() => this._alive)
      )
      .subscribe();


  }

  ngOnDestroy() {
    this._alive = false;
  }
}
