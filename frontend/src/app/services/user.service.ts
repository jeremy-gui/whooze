import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../models/user';
import {environment} from '../../environments/environment';
import {mergeMap} from 'rxjs/operators';


@Injectable()
export class UserService {

  // http options used for making API calls
  private httpOptions: any;

  // the actual JWT token
  public token: string;

  // the token expiration date
  public token_expires: number;

  // the email of the logged in user
  public email: string;

  public connected: boolean;

  // error messages received from the login attempt
  public errors: any = [];

  baseUrl: string = environment.apiUrl;
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user) {


    this.http.post(`${this.baseUrl}api-token-auth/`, JSON.stringify(user), this.httpOptions).subscribe(
      data => {
        // console.log(data);
        this.updateData(data['token']);
        this.connected = true;
      },
      err => {
        this.errors = err.error;
        this.connected = false;
      }
    );
  }
  // Refreshes the JWT token, to extend the time the user is logged in
  public refreshToken() {
    this.http.post(`${this.baseUrl}api-token-refresh/`, JSON.stringify({token: this.token}), this.httpOptions).subscribe(
      data => {
        // console.log(data);
        this.updateData(data['token']);
        this.connected = true;
      },
      err => {
        this.errors = err.error;
        this.connected = false;
      }
    );
  }

   verifyToken(token: any): any {
    this.http.post(`${this.baseUrl}api-token-verify/`, JSON.stringify({'token': token}), this.httpOptions).subscribe(
      data => {
        // console.log(data);
        this.updateData(data['token']);
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
    this.token = null;
    this.token_expires = null;
    this.email = null;
    localStorage.clear();
    this.connected = false;

  }

  createUser(user: any): Observable<any> {
       return this.http.post(`${this.baseUrl}timesapp/users/create`, JSON.stringify({ user }), this.httpOptions);
  }

  createUserThenConnect(user: User): Observable<any> {
        return this.createUser(user).pipe(
          mergeMap((datasucces) => {
            return this.loginUser(user);
          })
        );
  }
  public updateData(token) {
    this.token = token;
    this.errors = [];

    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = token_decoded.exp * 1000;
    this.email = token_decoded.email;
  }

  loginUser(userData: any): Observable<any> {
    const url = `${this.baseUrl}api-token-auth/`;
    return this.http.post(url, userData, {headers: this.httpHeaders});
  }

}
