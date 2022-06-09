import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { MainComponent } from "./main.component";
import { ProductListComponent } from "./product-list/product-list.component"; 
import { ProductComponent } from "./product/product.component"; 
import { CartComponent } from "./cart/cart.component"; 
import { OrderDetailsComponent } from "./order-details/order-details.component"; 

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: "",
        component: ProductListComponent,
      },
      {
        path: "cart",
        component: CartComponent,
      },
      {
        path: "order-details",
        component: OrderDetailsComponent,
      },
      {
        path: ":id",
        component: ProductComponent,
      },
      { path: "**", redirectTo: "" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}

export const ROUTING_COMPONENTS = [
  ProductListComponent,
  ProductComponent,
  CartComponent,
  OrderDetailsComponent,
];