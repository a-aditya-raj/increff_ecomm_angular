import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { Users } from "../../model/users";
import { USER_KEY } from "src/model/constant";
import { ApiService } from "./api-service.service";
import { StorageService } from "./storage-service.service";
import { ToastService } from "./toast-service.service";

// Contains all the login related methods
@Injectable()
export class LoginManager {
  private _user: Users;
  redirectUrl: string;

  constructor(
    private _apiService: ApiService,
    private _storageService: StorageService,
    private _router: Router,
    private _toastService: ToastService,
  ) {}

  get userName() {
    return this._user?.name || "";
  }

  get user(): Users {
    this._user = this._storageService.getLocal(USER_KEY);
    return this._user;
  }

  private _setUser(user: Users) {
    this._user = { ...user } as Users;
    this._storageService.saveLocal(USER_KEY, user);
  }

  checkSession() {
    if (!this.isAuthenticated()) {
      this._toastService.error("User not logged in!");
      this.redirectToLogin();
      return false;
    }
    return true;
  }

  redirectToLogin() {
    this._router.navigateByUrl("/app-login");
  }

  isAuthenticated() {
    const loggedInUser = this.user;
    return !!(loggedInUser && loggedInUser?.id);
  }

  resetUser() {
    this._user = void 0 as any;
  }

  login(email: string, password: string): Observable<any> {
    return this._apiService.getUsers().pipe(
      map((response) => {
        if (response.status === 200) {
          const loggedInUser = response.body.filter(
            (user: Users) => user.email === email && user.password === password
          );
          if (loggedInUser?.length) {
            this._setUser(loggedInUser[0]);
            return loggedInUser[0];
          } else return false;
        }
        return response;
      }),
      catchError((err) => err)
    );
  }

  logout() {
    this._storageService.clearLocal(USER_KEY);
    this.resetUser();
    this._toastService.success('User logged out successfully!');
    this.redirectToLogin();
  }
}