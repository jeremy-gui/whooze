import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {throwError} from 'rxjs';
import {GlobalService, UserService} from '../services/services.index';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean;
  sepcerror: string;
  title: string;

  public user: any;

  constructor( private fb: FormBuilder,
               public _userService: UserService,
               private global: GlobalService,
               private router: Router
               ) { }

  ngOnInit(): void {
    this.loading = false;
    this.title = environment.title;
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (localStorage.getItem('token') && localStorage.getItem('account')) {
      this.global.me = JSON.parse(localStorage.getItem('account'));
      this._userService.connected = true;
      console.log('if');
      this.router.navigate(['/']);
    }
  }
  login() {
    this.loading = true;
    this._userService.loginUser(this.loginForm.value).subscribe (
      response => {
        this.loading = false;
        localStorage.setItem('token', response.token);
        this._userService.connected = true;
        this.global.me = response.user;
        this.router.navigate(['/']);
      },
      error => {
        this.loading = false;
        this.loginForm.setErrors({ NoEmailorPasswordmatch: true })
        this._userService.connected = false;
        this.sepcerror = 'Wrong email and/or password';
      }
    );
  }

  refreshToken() {
    this._userService.refreshToken();
  }

  logout() {
    this._userService.logout();
  }
}


