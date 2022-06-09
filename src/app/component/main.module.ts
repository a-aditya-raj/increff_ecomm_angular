import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

import { MainRoutingModule, ROUTING_COMPONENTS } from "./main-routing.module";
import { MainComponent } from "./main.component";
import { ProductListComponent } from "./product-list/product-list.component"; 
import { ProductDemoComponent } from "./product-list/product-demo/product-demo.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    SharedModule,
    MainRoutingModule,
  ],
  declarations: [MainComponent, ...ROUTING_COMPONENTS, ProductListComponent, ProductDemoComponent],
})
export class MainModule {}