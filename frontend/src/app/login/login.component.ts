import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription, throwError} from 'rxjs';
import {GlobalService, UserService} from '../services/services.index';
import {environment} from '../../environments/environment';
import {User} from '../models/user';

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
  user: User;
  userSub: Subscription;


  constructor( private fb: FormBuilder,
               public _userService: UserService,
               private global: GlobalService,
               private router: Router
               ) { }

  ngOnInit(): void {
    if (localStorage.getItem('cantcomeback') === 'true') {
      if (localStorage.getItem('manchestarted')) {
        localStorage.setItem('cantcomeback', 'false');
        this.router.navigate(['manche']);
      }
    }
    this.loading = false;
    this.title = environment.title;
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (localStorage.getItem('access_token') && localStorage.getItem('account')) {
      this.global.me = JSON.parse(localStorage.getItem('account'));
      this.userSub = this.global.user.subscribe(
        me => this.user = me
      );
      this.global.me = JSON.parse(localStorage.getItem('account'));
      this._userService.connected = true;
      this.router.navigate(['/']);
    }
  }
  login() {
    this.loading = true;
    this._userService.loginAndGetUser(this.loginForm.value).subscribe (
      response => {
        console.log(response[0]);
        this.loading = false;
        this._userService.connected = true;
        this.user = new User();
        this.user.id = response[0].id;
        this.user.email = response[0].email;
        this.global.me = this.user;
        this.router.navigate(['/']);
      },
      error => {
        console.log(error);
        this.loading = false;
        this.loginForm.setErrors({ NoEmailorPasswordmatch: true });
        this._userService.connected = false;
        this.sepcerror = 'Wrong email and/or password';
      }
    );
  }

  refreshToken() {
    //this._userService.refreshToken();
  }

  logout() {
    this._userService.logout();
  }
}


