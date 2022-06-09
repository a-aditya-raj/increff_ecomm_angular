import { Component, OnInit } from '@angular/core';
import * as _ from "lodash";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { ToastService } from 'src/app/services/toast-service.service';
import { Users } from 'src/model/users';
import { LoginManager } from 'src/app/services/login.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ApiService } from 'src/app/services/api-service.service';
import { StorageService } from 'src/app/services/storage-service.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginManager,ApiService, StorageService, ToastService, FormBuilder]
})

export class LoginComponent implements OnInit {
  form: FormGroup;
  initialValues: any;
  serverError: string;
  submitting: boolean;

  constructor(
    private _router: Router,
    private _loginManager: LoginManager,
    private _formBuilder: FormBuilder,
    private _toastService: ToastService,
    private title: Title,
  ) { }

  get email() {
    return this.form.get("email");
  }
  get password() {
    return this.form.get("password");
  }

  isControlValid(control: AbstractControl | null) {
    return (
      control?.invalid &&
      (control?.dirty || control?.touched) &&
      control?.errors
    );
  }

  // Initial form registeration
  registerForm() {
    this.form = this._formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  private navigateToPage() {
    if (this._loginManager.isAuthenticated()){
      this._router.navigateByUrl("/");
    }
  }

  // Returning only those fields which have a value
  getPostData(): object {
    const data: { [key: string]: any } = {};
    _.forEach(this.form.value, (value: any, key: string) => {
      if (!(value === null && this.initialValues[key] === null))
        data[key] = value;
    });
    return data;
  }

  submitForm() {
    this.serverError = "";
    _.forEach(this.form.controls, (control: AbstractControl) => {
      control.markAsTouched();
    });

    if (!this.form.invalid) {
      // Check for multiple logins
      if (this._loginManager.isAuthenticated()) {
        this._toastService.error("User already logged in!");
        this.navigateToPage();
        return;
      }

      this.submitting = true;
      this.submit(this.getPostData() as any)
        .pipe(
          finalize(() => {
            this.submitting = false;
          })
        )
        .subscribe(
          (res) => this.onSubmitSuccess(res),
          (err) => this.onSubmitError(err)
        );
    }
  }

  submit(user: { email: string; password: string }): Observable<any> {
    this.submitting = true;
    return this._loginManager.login(user.email, user.password);
  }

  onSubmitSuccess(response: Users) {
    if (response) {
      this._toastService.success('User logged in successfully!');
      this.navigateToPage();
    }
    else this.serverError = "Username or password error";
  }

  onSubmitError(error: any) {
    this.serverError = error;
  }

  reset() {
    this.serverError = "";
    this.form.reset(this.initialValues);
  }

  ngOnInit() {
    this.title.setTitle("Login");
    this.registerForm();
    if(this._loginManager.isAuthenticated()){
      this.navigateToPage();
    }
  }
}
