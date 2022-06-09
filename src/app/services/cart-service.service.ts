import { Injectable, ViewChild } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { LoginManager } from "./login.service";
import { StorageService } from "./storage-service.service";
import { ToastService } from "./toast-service.service";
import { Product } from "src/model/product";
import { CART_KEY } from "src/model/constant";
import { UsersService } from "./users.service";
import { ProductListService } from "./product-list.service";

@Injectable()
export class CartService {
  private quantity = new BehaviorSubject<number>(this.getQuantity());

  constructor(
    private _userService: UsersService,
    private _storageService: StorageService,
    private _loginService: LoginManager,
    private _toastService: ToastService,
    private _products_list: ProductListService,
  ) { }

  getQuantitySubscription(): Observable<number> {
    return this.quantity.asObservable();
  }
  getQuantityOfEach(userId: number, productId: number): number {
    let localCart = localStorage.getItem("cart_items");
    if (localCart != null) {
      let presentCart = JSON.parse(localCart);
      let initial = presentCart[userId];
      if (!initial.length) {
        return 0;
      }
      else {
        for (let item of initial) {
          if (item.id === productId) {
            return item.quantity;
          }
        }
        return 0;
      }
    }
    return 0;
  }
  getQuantity(): number {
    const userId = this._userService.getCurrentUserId();
    var total: number = 0;
    let localCart = localStorage.getItem("cart_items");
    if (localCart != null) {
      let presentCart = JSON.parse(localCart);
      let initial = presentCart[userId];
      if (!initial.length) {
        return total;
      }
      else {
        for (let item of initial) {
          total += item.quantity;
        }
      }
    }
    return total;
  }

  // Emits the Quantity to the subscribers
  updateQuantity() {
    this.quantity.next(this.getQuantity());
    // this._navbar.totalquantity = this.getQuantity();
  }

  updateCartItemQuantity(productId: number, quantity: number) {
    if (!this._loginService.checkSession()) return;

    const cartItems = this.getCartItems();
    const index = cartItems.findIndex((item) => item.id === productId);

    if (index !== -1) {
      cartItems[index].quantity += quantity;

      this.setCartItems(cartItems);
      this.updateQuantity();
      this._toastService.success("Product updated successfully!");
    } else this._toastService.error("Product not found"!);
  }

  getLoggedInUserCartMap() {
    return this._storageService.getLocal(CART_KEY) ?? {};
  }

  // Returns cart items specific to the current login user
  getCartItems(): Product[] {
    const cartItemMap = this.getLoggedInUserCartMap();
    const user = this._loginService.user;
    if (!user) {
      return [];
    }
    return cartItemMap.hasOwnProperty(user.id) ? cartItemMap[user.id] : [];
  }

  // Sets cart items specific to the current login user
  setCartItems(values: Product[]): void {
    const cartMap = this.getLoggedInUserCartMap();
    const user = this._loginService.user;

    cartMap[user.id] = values;
    this._storageService.saveLocal(CART_KEY, cartMap);
  }

  addToCart(id: number, quantity: number) {
    if (!this._loginService.checkSession()) return;

    if (quantity < 1) {
      this._toastService.error("Quantity should be atleast one!");
      return;
    }

    const cartItems = this.getCartItems() || [];
    if (cartItems.length) {
      const index = cartItems.findIndex((item) => item.id === id);
      if (index !== -1) {
        cartItems[index].quantity = quantity;

        this.setCartItems(cartItems);
        this.updateQuantity();
        this._toastService.success("Cart Updated successfully!");

        return;
      }
    }
    // Adding in the cart if the product is not found in the cart
    cartItems.push({
      id,
      quantity,
    } as Product);

    this.setCartItems(cartItems);
    this.updateQuantity();
    this._toastService.success("Product added successfully!");
  }

  removeCartItem(productId: number) {
    if (!this._loginService.checkSession()) return;

    let cartItems = this.getCartItems();
    cartItems = cartItems.filter((item) => item.id !== productId);

    this.setCartItems(cartItems);
    this.updateQuantity();

    this._toastService.success("Product deleted successfully!");
    return true;
  }



  incrementQuantity(userId: string, productId: number): void {
    let localCart = localStorage.getItem("cart_items")
    if (localCart != null) {
      let presentCart = JSON.parse(localCart)
      let initial: number = presentCart[userId][productId];
      if (initial == undefined) initial = 0;
      presentCart[userId][productId] = initial + 1;
      localStorage.setItem("cart_items", JSON.stringify(presentCart));
    }
  }
  decrementQuantity(userId: string, productId: number): void {
    let localCart = localStorage.getItem("cart_items")
    if (localCart != null) {
      let presentCart = JSON.parse(localCart)
      let initial: number = presentCart[userId][productId];
      if (initial == undefined) initial = 0;
      if (initial <= 0) return;
      presentCart[userId][productId] = initial - 1;
      localStorage.setItem("cart_items", JSON.stringify(presentCart));
    }
  }
  removeProduct(userId: string, productId: number): void {
    let localCart = localStorage.getItem("cart_items")
    if (localCart != null) {
      let presentCart = JSON.parse(localCart)
      let initial: number = presentCart[userId][productId];
      if (initial == undefined) initial = 0;
      if (initial < 0) return;
      delete presentCart[userId][productId];
      localStorage.setItem("cart_items", JSON.stringify(presentCart));
    }
  }
  removeAll(userId: string): void {
    let localCart = localStorage.getItem("cart_items");
    if (localCart != null) {
      let presentCart = JSON.parse(localCart);
      presentCart[userId] = [];
      localStorage.setItem("cart_items", JSON.stringify(presentCart));
    }
  }
}