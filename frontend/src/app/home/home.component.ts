import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService, GlobalService} from '../services/services.index';
import {User} from '../models/user';
import { Subscription } from 'rxjs';
import {Router} from '@angular/router';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  message: string;

  constructor(
    public _userService: UserService, private router: Router,
  ) { }

  ngOnInit() {
    if (localStorage.getItem('cantcomeback') === 'true') {
      if (localStorage.getItem('manchestarted')) {
        localStorage.setItem('cantcomeback', 'false');
        this.router.navigate(['manche']);
      }
    }
  }


}
