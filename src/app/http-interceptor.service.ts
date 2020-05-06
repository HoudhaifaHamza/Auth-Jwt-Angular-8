import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { LogInService } from './components/log-in/log-in.service';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  tokenSubject: any;
  constructor(private logInService: LogInService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    let currentUser = this.logInService.currentUserVal;
    if (currentUser) {
      req = this.addToken(req, currentUser);
    }
    return next.handle(req).pipe(
    catchError(this.handleError))
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      let erreur = error.error;
      errorMessage = erreur.message;
    } else {
      // server-side error
      let erreur = JSON.parse(error.error);
      errorMessage = erreur.message;
    }
    // console.log(errorMessage);
    return throwError(errorMessage);
  }


  addToken(req: HttpRequest<any>, token) {
    return req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
