import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthRequest } from 'src/app/model/authRequest';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LogInService } from './log-in.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit, OnDestroy {

  authRequest = {} as AuthRequest;
  authSubscription: Subscription;
  accessSubscription: Subscription;
  loginForm: FormGroup;
  submitted = false;
  errorMessage: string;
  isLoginFailed: boolean = false;
  failedMessage: string;
  failed: boolean = false;
  private readonly JWT_TOKEN: string = 'JWT_TOKEN';

  constructor(private logInService: LogInService, private router: Router, private formBuilder: FormBuilder,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.formGroupLogin();
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  toAuthenticate() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.spinner.show();
    this.authSubscription = this.logInService.generateToken(this.authRequest)
    .subscribe(
      data => {
        this.logInService.autoritySubject.next(true);
        this.router.navigate(['home']);
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      },

      err => {
        console.log(err);
        this.spinner.show();
        this.failedMessage = err;
        this.failed = true;
        this.onReset();
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      }
    );
  }

  formGroupLogin() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnDestroy() {
    if (this.authSubscription && !this.authSubscription.closed) {
      this.authSubscription.unsubscribe();
    }

    if (this.accessSubscription && !this.accessSubscription.closed) {
      this.accessSubscription.unsubscribe();
    }
  }

  onReset() {
    this.submitted = false;
    this.loginForm.reset();
  }

  toSignUp() {
    this.router.navigate(['register']);
  }

}
