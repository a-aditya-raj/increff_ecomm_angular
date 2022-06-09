import * as $ from "jquery";
import { Component, OnDestroy, OnInit, OnChanges } from "@angular/core";
import { Location } from "@angular/common";
import { CartComponent } from "src/app/component/cart/cart.component";
import { CartService } from "src/app/services/cart-service.service";
import { LoginManager } from "src/app/services/login.service";
import { StorageService } from "src/app/services/storage-service.service";
import { ApiService } from "src/app/services/api-service.service";
import { ToastService } from "src/app/services/toast-service.service";
import { UsersService } from "src/app/services";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
  providers: [CartService, StorageService, LoginManager, ApiService, ToastService, CartComponent],
})
export class NavbarComponent implements OnInit, OnChanges, OnDestroy {
  quantity: number;
  totalquantity: number;

  date: string;
  dateIntervalId: any;

  constructor(
    private _cartService: CartService,
    private _location: Location,
    private _loginService: LoginManager,
    private _cartComponent: CartComponent,
    private _userService: UsersService,
  ) { }

  getName() {
    return this._userService.getCurrentUser();
  }
  getQuantity(): number {
    return this._cartService.getQuantity();
  }
  canShow(path: string) {
    return this._location.path() !== path;
  }
  toggle(id: string){
    jQuery(id).toggle();
  }
  logout() {
    this._loginService.logout();
  }
  quant = this._cartComponent.productList.length;

  ngOnChanges() {
    this._cartService.updateQuantity();
  }

  ngOnInit() {
    const tooltip = jQuery('[data-toggle="tooltip"]') as any;
    tooltip.tooltip();

    jQuery("#myTooltip").on("hidden.bs.tooltip", function () {
      // do something...
      console.log("tooltip");
    });

    this._cartService
      .getQuantitySubscription()
      .subscribe((cartQuantity: number) => (this.quantity = cartQuantity));
    this._cartService.updateQuantity();
  }

  ngOnDestroy() {
    clearInterval(this.dateIntervalId);
  }
}