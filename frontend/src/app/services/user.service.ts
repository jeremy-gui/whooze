import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../models/user';
import {environment} from '../../environments/environment';
import {mergeMap, switchMap} from 'rxjs/operators';


@Injectable()
export class UserService {

  // http options used for making API calls
  private httpOptions: any;

  // the actual JWT token
  public refresh_token: string;
  public access_token: string;

  // the token expiration date
  public token_expires: number;

  // the user logedin
  public user: User;

  public connected: boolean;

  // error messages received from the login attempt
  public errors: any = [];

  baseUrl: string = environment.apiUrl;
  tokUrl: string = environment.tokUrl;
  authUrl: string = environment.authUrl;
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user) {


    this.http.post(`${this.authUrl}api-token-auth/`, JSON.stringify(user), this.httpOptions).subscribe(
      data => {
        // console.log(data);
        this.updateData(data['access'],data['refresh']);
        this.connected = true;
      },
      err => {
        this.errors = err.error;
        this.connected = false;
      }
    );
  }
  // Refreshes the JWT token, to extend the time the user is logged in
  public refreshToken(tok: any): Observable<HttpEvent<any>> {
    return this.http.post<HttpEvent<any>>(`${this.authUrl}api-token-refresh/`,JSON.stringify({refresh: tok}),  this.httpOptions);
  }
  public askForUpdateToken(tok: any): Observable<any> {
      return this.http.post(`${this.authUrl}api-token-refresh/`,JSON.stringify({refresh: tok}),  this.httpOptions);

  }

   verifyToken(token: any): any {
    this.http.post(`${this.authUrl}api-token-verify/`, JSON.stringify({'refresh_': token}), this.httpOptions).subscribe(
      data => {
        // console.log(data);
        this.updateData(data['access'], data['refresh']);
        this.connected = true;
        return true;
      },
      err => {
        this.errors = err.error;
        this.connected = false;
        return false;
      }
    );
  }

  public logout() {
    this.access_token = null;
    this.refresh_token = null;
    this.token_expires = null;
    this.user = null;
    localStorage.clear();
    this.connected = false;

  }

  createUser(user: any): Observable<any> {
       return this.http.post(`${this.baseUrl}users/create`, JSON.stringify({ user }), this.httpOptions);
  }

  createUserThenConnect(user: User): Observable<any> {
        return this.createUser(user).pipe(
          mergeMap((datasucces) => {
            return this.loginUser(user);
          })
        );
  }
  public updateData(access, refresh) {
    this.access_token = access;
    this.refresh_token = refresh;
    this.errors = [];
    // decode the token to read the username and expiration timestamp
    const token_parts = this.access_token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = token_decoded.exp * 1000;
    this.user = new User();
    this.user.id = token_decoded.user_id;
  }

  loginUser(userData: any): Observable<any> {
    const url = `${this.authUrl}api-token-auth/`;
    return this.http.post(url, userData, {headers: this.httpHeaders});
  }

  getUser(user: User): Observable<any> {
    return this.http.get(`${this.tokUrl}user/get/${user.id}`, this.httpOptions);
  }
  loginAndGetUser(user: User): Observable<any> {
    return this.loginUser(user).pipe(
      mergeMap(datasucces => {

        localStorage.setItem('access_token', datasucces.access);
        localStorage.setItem('refresh_token', datasucces.refresh);
        this.updateData(datasucces.access, datasucces.refresh);
        return this.getUser(this.user);
      })
    );
  }

  isAccessTokenExpired() {
    if (localStorage.getItem('refresh_token')) {
      this.updateData(localStorage.getItem('access_token'), localStorage.getItem('refresh_token'));
      if (this.token_expires) {
        return this.token_expires > Date.now();
      }
      return true;
    } else {
      return false;
    }
  }

}
