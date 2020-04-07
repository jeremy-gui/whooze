import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../models/user';
import {environment} from '../../environments/environment';


@Injectable()
export class UserService {

  // http options used for making API calls
  private httpOptions: any;

  // the actual JWT token
  public token: string;

  // the token expiration date
  public token_expires: Date;

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
        console.log(data);
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
        console.log(data);
        this.updateData(data['token']);
        this.connected = true;
      },
      err => {
        this.errors = err.error;
        this.connected = false;
      }
    );
  }

  public logout() {
    this.token = null;
    this.token_expires = null;
    this.email = null;
    localStorage.removeItem('token');
    localStorage.removeItem('account');
    this.connected = false;
  }

  private updateData(token) {
    this.token = token;
    this.errors = [];

    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.email = token_decoded.email;
  }

  loginUser(userData: any): Observable<any> {
    const url = `${this.baseUrl}api-token-auth/`;
    return this.http.post(url, userData, {headers: this.httpHeaders});
  }

}
