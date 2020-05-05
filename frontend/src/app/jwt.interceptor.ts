import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserService} from './services/user.service';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';
import {switchMap, tap} from 'rxjs/operators';


  @Injectable()
  export class JwtInterceptor implements HttpInterceptor {
    baseUrl: string = environment.apiUrl;
    tokUrl: string = environment.tokUrl;
    authUrl: string = environment.authUrl;

    constructor(public _userService: UserService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let clone: HttpRequest<any>;
      if ((request.url !== this.authUrl + 'api-token-refresh/') && (request.url !== this.authUrl + 'api-token-auth/') && (request.url !== this.baseUrl + 'users/create')) {
        let token = localStorage.getItem('access_token');
        let tokenrefresh = localStorage.getItem('refresh_token');

        if (token) {
          const tokisgood = this._userService.isAccessTokenExpired();

          if (tokisgood) {
            return this._userService.refreshToken(tokenrefresh).pipe(
              switchMap(result => {
              this._userService.updateData(result['access'], result['refresh']);
              this._userService.connected = true;
              token = result['access'];
              tokenrefresh = result['refresh'];

              localStorage.setItem('access_token', token);
              localStorage.setItem('refresh_token', tokenrefresh);
              clone = request.clone({
                setHeaders: {
                  Accept: `application/json`,
                  'Content-Type': `application/json`,
                  Authorization: `Bearer ${token}`
                }
              });
              console.log('new token');
              console.log(clone.headers);
              return next.handle(clone);
            })
            );
          }
        } else {
          console.log('token not good');
          clone = request.clone({
            setHeaders: {
              Accept: `application/json`,
              'Content-Type': `application/json`
            }
          });
          console.log(clone.url+request.url);
          return next.handle(clone);

        }
      } else {
        console.log('not refresh');
        clone = request.clone({
          setHeaders: {
            Accept: `application/json`,
            'Content-Type': `application/json`
          }
        });
        console.log(clone.url+request.url);
        return next.handle(clone);

      }
    }
  }
