import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forEach } from 'lodash';
import  creds  from 'src/assets/creds.json';
import { LoginManager } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private currentPasswords = creds;
  getCurrentUser(): string {
    let currentUser = localStorage.getItem("user");
    if (currentUser != undefined) {
      const users = JSON.parse(currentUser);
      for( let user of this.currentPasswords){
        if(users.id === user.id){
          return users.name;
        }
      }
    }
    //this.router.navigate(['/login'])
    return "";
  }
  getCurrentUserId(): number {
    let currentUser = localStorage.getItem("user");
    if (currentUser != undefined) {
      const users = JSON.parse(currentUser);
      for( let user of this.currentPasswords){
        if(users.id === user.id){
          return users.id;
        }
      }
    }
    else{
      this._loginService.logout();
      this._loginService.redirectToLogin();
    }
    
    return 0;
  }
  constructor(private router: Router, private _loginService: LoginManager) { }
}
