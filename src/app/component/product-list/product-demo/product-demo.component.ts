import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from "src/app/services";

import { CartService } from "src/app/services/cart-service.service";
import { Product } from "src/model/product";
import { CartComponent } from "../../cart/cart.component";

interface CartItem {
  id: number;
  quantity: number;
}

@Component({
  selector: "product-demo",
  templateUrl: "product-demo.component.html",
  styleUrls: ["./product-demo.component.css"],
})
export class ProductDemoComponent {
  @Input() product: Product;
  cartItems: CartItem[] = [];
  quantity: number = 1;
  

  constructor(
    private _cartService: CartService,
    private _userService: UsersService,
    public _cartComponent: CartComponent,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }






  navigateToDetail() {
    this._router.navigate([this.product.id], {
      relativeTo: this._route,
    });
  }

  isInCart() {
    const item = this._cartComponent.getCartItem(this.product.id);
    if (item) {
      return true;
    }
    return false;
  }

  getQuantity(productId: number) {
    return this._cartService.getQuantityOfEach(this._userService.getCurrentUserId(),productId);
  }
  updateQuantity(quantity: number) {
    let item = this._cartComponent.getCartItem(this.product.id) as CartItem;
    if (item) {
      item.quantity += quantity;

      if (item.quantity <= 0) {
        this._cartComponent.deleteProduct(this.product.id);
        return;
      }
      else {
        this._cartService.addToCart(this.product.id, item.quantity);
      }
    }
    else {
      this._cartService.addToCart(this.product.id, quantity);
    }
  }
  toggleValue(event: MouseEvent, id: number) {
    event.preventDefault();
    event.stopPropagation();
  }
  change(event: any) { console.log(event.target.value); }
}