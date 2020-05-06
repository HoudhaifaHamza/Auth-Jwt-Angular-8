import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequest } from 'src/app/model/authRequest';
import { pipe, BehaviorSubject, Observable } from 'rxjs';
import { map, take, filter, first, tap, mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  glolabUrl: string = "http://localhost:9092/";
  authetnticationUrl: string = "api/authenticate";
  accessUrl: string = "api/home";
  private readonly JWT_TOKEN: string = 'JWT_TOKEN';
  private readonly authority_Ls: string = "authority_Ls";
  public _currentUserSubject: BehaviorSubject<AuthRequest>;
  public currentUser: Observable<AuthRequest>;
  autoritySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get currentUserVal(): AuthRequest {
    return this._currentUserSubject.value;
  }

  get currentUserToken() {
    return this.currentUserVal;
  }

  constructor(private httpClient: HttpClient) {

    this._currentUserSubject = new BehaviorSubject<AuthRequest>(this.getUserFromLocalStorage());
    this.currentUser = this._currentUserSubject.asObservable();
    this.autoritySubject = new BehaviorSubject<boolean>(this.getAuthorityFromLocalStorage());

  }

  generateToken(authRequest: AuthRequest) {
    return this.httpClient.post<any>(`${this.glolabUrl}${this.authetnticationUrl}`, authRequest, { responseType: 'text' as 'json' })
      .pipe(
        // tap(data => {
        //     localStorage.setItem(this.JWT_TOKEN, data);
        //     this._currentUserSubject.next(data);
        // }),
          map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem(this.JWT_TOKEN, JSON.stringify(user));
          this._currentUserSubject.next(user);
          return user;
        })
      );
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  private getUserFromLocalStorage(): AuthRequest {
    try {
      return JSON.parse(localStorage.getItem(this.JWT_TOKEN)!);
    } catch (error) {
      return null!;
    }
  }


  private getAuthorityFromLocalStorage() : boolean {
    try {
      return JSON.parse(localStorage.getItem(this.authority_Ls));
    } catch (error) {
      return null!;
    }
  }


  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem(this.JWT_TOKEN);
    this._currentUserSubject.next(null);
  }
}
