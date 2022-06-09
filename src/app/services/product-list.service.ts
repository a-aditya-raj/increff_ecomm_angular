import { Injectable } from '@angular/core';
import { Product } from 'src/model/product';
import products from "src/assets/products.json";

@Injectable({
  providedIn: 'root'
})
export class ProductListService {


  products_list = products ;
  //gets all products
  getAllProducts(): Product[] {
    return this.products_list;
  }
  //gets specific product
  getProduct(ProductId: any): Product {
    for (let item of this.products_list) {
      if (item.id == ProductId)
        return item;
    }
    return {
      "id": 0,
      "brand": "",
      "name": "",
      "category": "",
      "imageUrl": "",
      "mrp": 0,
      "description": "",
      "material": "",
      "clientSkuId": "",
      "color": "",
      "size": "",
      "styleId": "",
      "images": [],
      "care": "",
      "quantity": 0,
    };
  }


  constructor() { }
}
