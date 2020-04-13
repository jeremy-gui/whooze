import { Component, OnInit } from '@angular/core';
import {GlobalService, JoueurService, UserService} from '../../services/services.index';
import { Router } from '@angular/router';
import {User} from '../../models/user';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Joueur} from '../../models/joueur';
import {dateComparator} from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-tools';
import {PartieService} from '../../services/partie.service';
import {Partie} from '../../models/partie';
import {EquipeService} from '../../services/services.index';
import {Equipe} from '../../models/equipe';

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
  partie: Partie = new Partie();
  partieSub: Subscription;

  equipe1: Equipe = new Equipe();
  equipe2: Equipe = new Equipe();
  equipe1Sub: Subscription;
  equipe2Sub: Subscription;

  joueursTeam1Sub: Subscription;
  joueursTeam1: Joueur[];
  joueursTeam2Sub: Subscription;
  joueursTeam2: Joueur[];

  title = environment.title;
  message: string;
  currentPage: string;

  constructor(
    public router: Router,
    public _userService: UserService,
    private global: GlobalService,
    public _joueurService: JoueurService,
    public _partieService: PartieService,
    public _equipeService: EquipeService,
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
        this.global.megamer = JSON.parse(localStorage.getItem('joueur'));
        this.joueurSub = this.global.joueur.subscribe(
          megamer => this.joueur = megamer
        );
        this._joueurService.joueurCreated = true;

        if (localStorage.getItem('partie')) {
          this.global.megame = JSON.parse(localStorage.getItem('partie'));
         // console.log(localStorage.getItem('partie'));
          this.partieSub = this.global.partie.subscribe(
            megame => this.partie = megame
          );
          this._partieService.partieCreated = true;

          this.global.meteam1 = JSON.parse(localStorage.getItem('equipe1'));
          this.global.meteam2 = JSON.parse(localStorage.getItem('equipe2'));
          // console.log(localStorage.getItem('partie'));
          this.equipe1Sub = this.global.equipe1.subscribe(
            meteam1 => this.equipe1 = meteam1
          );
          this.equipe2Sub = this.global.equipe2.subscribe(
            meteam2 => this.equipe2 = meteam2
          );
          this.global.joueurs_team1 = JSON.parse(localStorage.getItem('joueurs_team1'));
          this.global.joueurs_team2 = JSON.parse(localStorage.getItem('joueurs_team2'));
          this.joueursTeam1Sub = this.global.joueursTeam1.subscribe(
            joueurs_team1 => this.joueursTeam1 = joueurs_team1
          );
          this.joueursTeam2Sub = this.global.joueursTeam2.subscribe(
            joueurs_team2 => this.joueursTeam2 = joueurs_team2
          );
         }
     }
  }



    logout() {
    this.userSub.unsubscribe();

    this._userService.logout();
    this.router.navigate(['/']);
  }
}
