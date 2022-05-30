import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';


import { AuthService } from '../services/auth.service';
import { LoaderService } from '../services/loader.service';
import { ToastService } from '../services/toast.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const milliseconds = Math.floor((new Date).getTime() / 1000);
    const token = localStorage.getItem('token');
    const exp = Number(localStorage.getItem('exp'));

    // // console.log('current:', milliseconds);
    // // console.log('expire :', exp);

    this.loaderService.show();

    if (token) {
      if (milliseconds < exp) {
        const cloned = req.clone({
          headers: req.headers.set('x-access-token', token)
        });

        return next.handle(cloned).pipe(
          tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              this.loaderService.hide();
            }
          }, (err: any) => {
            this.loaderService.hide();
          }));
      } else {
        this.authService.logout();
        this.router.navigate(['/home']);
        this.toastService.error('Session has been expired, please login again');
        this.loaderService.hide();
      }
    } else {
      return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.loaderService.hide();
        }
      }, (err: any) => {
        this.loaderService.hide();
      }));
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}
