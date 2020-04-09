import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService, GlobalService} from '../services/services.index';
import {User} from '../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  message: string;

  constructor(
    public _userService: UserService
  ) { }

  ngOnInit() {
  }


}
