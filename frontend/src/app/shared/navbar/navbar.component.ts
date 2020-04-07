import { Component, OnInit } from '@angular/core';
import {GlobalService, UserService} from '../../services/services.index';
import { Router } from '@angular/router';
import {User} from '../../models/user';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  account: User = new User();
  userSub: Subscription;
  title = environment.title;


  constructor(
    private router: Router,
    public _userService: UserService,
    private global: GlobalService
  ) { }

  ngOnInit() {
    if (!localStorage.getItem('token') || !localStorage.getItem('account')) {
      this._userService.connected = false;
      this.router.navigate(['/']);
      } else if (localStorage.getItem('token') || localStorage.getItem('account'))  {
      this.userSub = this.global.user.subscribe(
        me => this.account = me
      );
      this._userService.connected = true;
      this.global.me = JSON.parse(localStorage.getItem('account'));
     }
  }

  logout() {
    this.userSub .unsubscribe();

    this._userService.logout();
    this.router.navigate(['/']);
  }
}
