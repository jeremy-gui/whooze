import { Component, OnInit } from '@angular/core';
import {GlobalService, JoueurService, UserService} from '../../services/services.index';
import { Router } from '@angular/router';
import {User} from '../../models/user';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Joueur} from '../../models/joueur';
import {dateComparator} from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-tools';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  account: User = new User();
  joueur: Joueur = new Joueur();
  userSub: Subscription;
  joueurSub: Subscription;

  title = environment.title;
  message: string;

  constructor(
    private router: Router,
    public _userService: UserService,
    private global: GlobalService,
    public _joueurService: JoueurService,
  ) { }

  ngOnInit() {

    if (history.state.data && history.state.data.registerOk)    {
      this.message = 'Thank you for suscribing ! Now let\'s play tooooo ';
      history.state.data.registerOk.delete();
    }
    if (!localStorage.getItem('token') || !localStorage.getItem('account')) {
      this._userService.connected = false;
      this.router.navigate(['/']);
      } else if (localStorage.getItem('token') || localStorage.getItem('account')) {

      // on verifie d'abord que le token n'est pas sur le point d'expirer (dans les 3 jours)
      this._userService.updateData(localStorage.getItem('token'));
      const date1: number = Date.now();
      const diffDate: number = this._userService.token_expires - date1;

      if (diffDate <= 259200000) {
        if (this._userService.verifyToken(localStorage.getItem('token'))) {
          this.userSub = this.global.user.subscribe(
            me => this.account = me
          );
          this._userService.connected = true;
          this.global.me = JSON.parse(localStorage.getItem('account'));
        } else {
          this.logout();
        }
      } else if (diffDate > 259200000) {
        this.userSub = this.global.user.subscribe(
          me => this.account = me
        );
        this._userService.connected = true;
        this.global.me = JSON.parse(localStorage.getItem('account'));
      }
    }
    if (!localStorage.getItem('joueur')) {
        this._joueurService.joueurCreated = false;
        this.router.navigate(['/']);
      } else if (localStorage.getItem('joueur'))  {
        this.joueurSub = this.global.joueur.subscribe(
          megamer => this.joueur = megamer
        );
        this._joueurService.joueurCreated = true;
        this.global.megamer = JSON.parse(localStorage.getItem('joueur'));
     }
  }


    logout() {
    this.userSub.unsubscribe();

    this._userService.logout();
    this.router.navigate(['/']);
  }
}
