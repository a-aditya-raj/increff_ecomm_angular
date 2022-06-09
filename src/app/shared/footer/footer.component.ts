import * as $ from "jquery";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Location } from "@angular/common";

import { CartService } from "src/app/services/cart-service.service";
import { LoginManager } from "src/app/services/login.service";
import { StorageService } from "src/app/services/storage-service.service";
import { ApiService } from "src/app/services/api-service.service";
import { ToastService } from "src/app/services/toast-service.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
  providers: [CartService, StorageService, LoginManager, ApiService, ToastService],
})
export class FooterComponent implements OnInit, OnDestroy {
  quantity: number;
  userName: string;

  date: string;
  dateIntervalId: any;

  constructor(
    private _cartService: CartService,
    private _location: Location,
    private _loginService: LoginManager
  ) { }

  canShow(path: string) {
    return this._location.path() !== path;
  }

  getDateTime() {
    return new Date().toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      year: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  ngOnInit() {
    const tooltip = jQuery('[data-toggle="tooltip"]') as any;
    tooltip.tooltip();

    this.dateIntervalId = setInterval(() => {
      this.date = this.getDateTime();
    }, 1000);

    jQuery("#myTooltip").on("hidden.bs.tooltip", function () {
      // do something...
      console.log("tooltip");
    });
  }

  ngOnDestroy() {
    clearInterval(this.dateIntervalId);
  }
}