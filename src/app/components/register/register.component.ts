import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MustMatch } from 'src/app/helpers/must-match-validator';
import { User } from 'src/app/model/user.model';
import { RegisterService } from './register.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  Roles: any = ['Admin', 'Author', 'Reader'];

  registerForm: FormGroup;
  submitted = false;
  selected: string;
  user = {} as User;
  extistingMail: boolean = false;
  warningText: string;
  fieldTextType: boolean = false;
  failedMessage: string;
  successMessage: string;
  failed: boolean = false;
  success: boolean = false;

  constructor(private formBuilder: FormBuilder, private registerService: RegisterService, private router: Router,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.spinner.show();
    this.registerService.addUser(this.user).subscribe(data => {
      this.failed = false;
      this.successMessage = data.toString();
      this.success = true;
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    },
      err => {
        this.success = false;
        this.failedMessage = err;
        this.failed = true;
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      },
    );
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  toSignIn() {
    this.router.navigate(['login']);
  }

}
