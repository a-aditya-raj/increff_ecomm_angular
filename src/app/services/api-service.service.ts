import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpResponse,
} from "@angular/common/http";
import { catchError, finalize, tap } from "rxjs/operators";
import { Observable, of } from "rxjs";

// const RETRY_COUNT = new HttpContextToken(() => 3);
const USER_URL = "assets/creds.json";
const PRODUCT_URL = "assets/products.json";

@Injectable()
export class ApiService {
  constructor(private _httpClient: HttpClient) {}

  showLoader() {
    jQuery('#loader').removeClass('d-none');
  }

  hideLoader() {
    jQuery('#loader').addClass('d-none');
  }

  getUsers(): Observable<HttpResponse<any>> {
    this.showLoader();
    return this._httpClient
      .get(USER_URL, {
        observe: "response",
        responseType: "json",
      })
      .pipe(
        tap(),
        catchError((err) => {
          return of(err);
        }),
        finalize(() => this.hideLoader()),
      );
  }

  getProducts() {
    this.showLoader();
    return this._httpClient
      .get(PRODUCT_URL, {
        observe: "response",
        responseType: "json",
      })
      .pipe(
        catchError((err) => {
          return of(err);
        }),
        finalize(() => this.hideLoader()),
      );
  }
}