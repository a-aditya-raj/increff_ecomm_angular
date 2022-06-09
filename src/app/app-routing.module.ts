import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { AuthGuard } from './services/auth.guard';

import { CartComponent } from './component/cart/cart.component';
import { OrderDetailsComponent } from './component/order-details/order-details.component';
import { ProductComponent } from './component/product/product.component';
import { ProductListComponent } from './component/product-list/product-list.component';



const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "app-login",
        component: LoginComponent,
      },
      {
        path: "",
        loadChildren: () => import("./component/main.module").then((m) => m.MainModule),
        canActivate: [AuthGuard],
      },
      { path: "**", redirectTo: "" },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }