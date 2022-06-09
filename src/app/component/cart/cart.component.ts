import * as Papa from "papaparse";
import { NgModel } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { finalize, takeWhile, tap } from "rxjs/operators";

import { ApiService, ToastService, CartService, ProductListService, UsersService } from "src/app/services";
import { LoginManager } from "src/app/services";
import { Product } from "src/model/product";
import { Title } from "@angular/platform-browser";

interface CartItem {
  id: number;
  quantity: number;
}
declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean
  }
}
@Component({
  selector: "cart",
  templateUrl: "./cart.component.html",
  styles: [
    `
      .fa-trash-alt {
        position: absolute;
        bottom: 0;
        right: 0;
        color: #6c7575;
      }
      .fa-trash-alt:hover {
        color: #dc3545 !important;
      }
      .circle {
        border-radius: 50% !important;
        height: 22px;
        width: 22px;
        background-color: #ebeff4;
        box-shadow: 0 0.1rem 0.1rem rgb(0 0 0 / 10%);
      }
    `,
  ],
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  private _alive: boolean = true;

  productList: Product[] = [];
  cartItems: CartItem[] = [];

  paymentInfo: {
    total: number;
  };

  isProductsFetched: boolean = false;
  totalCount = 0;
  

  constructor(
    private _apiService: ApiService,
    private _cartService: CartService,
    private _loginService: LoginManager,
    private _toastService: ToastService,
    private modalService: NgbModal,
    private _products_list: ProductListService,
    private _userService: UsersService,
    private title: Title,
  ) { }

  getCartItem(productId: number) {
    let items = this._cartService.getCartItems();
    if(!items.length){
      return;
    }
    for (const item of items) {
      if (item.id === productId) {
        return item;
      }
    }
    return;
  }
  getQuantity1(): number {
    const cartItemMap = this._cartService.getCartItems();
    const totalQuantity = cartItemMap.reduce((accr: number, curr: Product) => {
      if (curr?.quantity > 0) accr += curr.quantity;
      return accr;
    }, 0);

    return totalQuantity || 0;
  }
  getQuantity(productId: number) {
    const item = this.getCartItem(productId);
    return item ? item?.quantity : 0;
  }

  updateQuantity(quantity: number, index: number) {
    const product = this.productList[index];
    let item = this.getCartItem(product.id) as CartItem;
    item.quantity += quantity;

    if (item.quantity <= 0) {
      this.askConfirmRemove(product.id);
      return;
    }

    this.paymentInfo.total += product.mrp * quantity;
    this.calculatePayment();
    this._cartService.updateCartItemQuantity(product.id, quantity);
  }

  calculatePayment() {
    this.paymentInfo.total = Number(
      (this.paymentInfo.total).toFixed(2)
    );
  }

  initializeCart() {
    this.isProductsFetched = false;
    this.totalCount = 0;
    this.paymentInfo = {
      total: 0,
    };
    this.productList = [];

    this.cartItems = this._cartService.getCartItems();
    if (this.cartItems?.length) {
      this._apiService
        .getProducts()
        .pipe(
          tap((response) => {
            const products = response.body as Product[];

            for (let item of this.cartItems) {
              const product = products.find(
                (product) => product.id === item.id
              ) as Product;
              if (product?.id > 0 && item?.quantity > 0) {
                this.paymentInfo.total += product.mrp * item.quantity;
                this.productList.push(product);
                ++this.totalCount;
              }
            }

            this.calculatePayment();
          }),
          takeWhile(() => this._alive),
          finalize(() => (this.isProductsFetched = true))
        )
        .subscribe();
    } else this.isProductsFetched = true;
  }

  deleteProduct(productId: number) {
    if (this._cartService.removeCartItem(productId)) this.initializeCart();
  }

  downloadOrder() {
    if (!this._loginService.checkSession()) return;
    const fields = ["id", "brand", "name", "clientSkuId", "size", "mrp"];
    let products: { [key: string]: any }[] = [];

    this.productList.forEach((product: any) => {
      const temp: { [key: string]: any } = {};
      fields.forEach((field) => {
        temp[field] = product[field];
      });

      // Payment calculation
      const item = this.getCartItem(product.id) as CartItem;
      if (item && item.quantity > 0) {
        temp["quantity"] = item?.quantity;
        temp["total"] = item?.quantity * product?.mrp;
        products.push(temp);
      }
    });
    products = products.sort((a, b) => a["id"] - b["id"]);

    const csv = Papa.unparse(products, {
      skipEmptyLines: true,
    });

    // converting to a blob file
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    let csvURL = null;

    if (navigator.msSaveBlob) {
      csvURL = navigator.msSaveBlob(csvData, "order.csv");
    } else {
      csvURL = window.URL.createObjectURL(csvData);
    }

    // creating a temporary element to mock a click and download the file.
    const tempLink = document.createElement("a");
    tempLink.href = csvURL as string;
    tempLink.setAttribute("download", "order"+ this.getDateTime() +".csv");
    tempLink.click();

    this._toastService.success("Order placed successfully!");
    this.openCheckoutSuccess(this.checkOutSuccess);
    this.clearCart();
  }
  removeThis = {
    id: 0,
    name: ""
  }
  getDateTime() {
    return new Date().toLocaleString("en-US", {
      year: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  askConfirmRemove(productId: any) {
    this.removeThis = {
      id: productId,
      name: this._products_list.getProduct(productId).name
    }
    this.openConfirmRemove(this.confirmRemove)
  }
  askConfirmClear() {
    this.openConfirmClear(this.confirmClear)
  }
  clearCart() {
    this._cartService.removeAll(this._userService.getCurrentUserId().toString());
    this.initializeCart();
  }
  @ViewChild('confirmRemove')
  confirmRemove!: NgModel;
  openConfirmRemove(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.getConfirmRemove(result);
    }, (reason) => {
      this.getConfirmRemove(reason);
    });
  }
  private getConfirmRemove(reason: any): void {
    if (reason == "confirm") { }
    this.deleteProduct(this.removeThis.id);
  }

  //modal for clearing cart
  @ViewChild('confirmClear')
  confirmClear!: NgModel;
  openConfirmClear(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.getConfirmClear(result);
    }, (reason) => {
      this.getConfirmClear(reason);
    });
  }
  private getConfirmClear(reason: any): void {
    if (reason == "confirm")
      this.clearCart()
  }

  //modal for cart checkout
  @ViewChild('checkOutSuccess')
  checkOutSuccess!: NgModel;
  openCheckoutSuccess(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }



  ngOnInit() {
    this.title.setTitle("Cart");
    this.initializeCart();
  }

  ngOnDestroy() {
    this._alive = false;
  }
}