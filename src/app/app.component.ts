import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogInService } from './components/log-in/log-in.service';
import { Router} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-material-login-template';
  autority: boolean;
  mySubscription: any;

  constructor(private router: Router, private logInService: LogInService,private spinner: NgxSpinnerService) {

    this.mySubscription = this.logInService.autoritySubject.subscribe(value => {
      this.autority = value;
      localStorage.setItem("authority_Ls", JSON.stringify(value));
    });
  }

  ngOnInit() {
    // this.autority = this.logInService.isLoggedIn();
  }

  toProduct() {
    this.router.navigate(['product']);
  }

  toHome() {
    this.router.navigate(['home']);
  }

  logOut() {
    this.spinner.show();
    this.logInService.autoritySubject.next(false);
    this.logInService.logout();
    this.router.navigate(['login']);
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }


}
