import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { LogInService } from './components/log-in/log-in.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {


  constructor(private logInService: LogInService, private router: Router) { }

  canActivate() {
    return this.canLoad();
  }
  canLoad() {
    const currentUserToken = this.logInService.currentUserToken;
    if (!currentUserToken) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
