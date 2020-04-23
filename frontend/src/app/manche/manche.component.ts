import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../models/user';
import {Subject, Subscription} from 'rxjs';
import {Joueur} from '../models/joueur';
import {Partie, StadePartieEnCours} from '../models/partie';
import {Equipe} from '../models/equipe';
import {Personnage} from '../models/personnage';
import {GlobalService} from '../services/global.service';
import {PersonnageService} from '../services/personnage.service';
import {UserService} from '../services/user.service';
import {JoueurService} from '../services/joueur.service';
import {PartieService} from '../services/partie.service';
import {EquipeService} from '../services/equipe.service';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-manche',
  templateUrl: './manche.component.html',
  styleUrls: ['./manche.component.css']
})
export class MancheComponent implements OnInit, OnDestroy {
  stadePartieEnCours: any;
  equipeEnCours: any;
  myteam: number;

  account: User = new User();
  userSub: Subscription;
  joueur: Joueur = new Joueur();
  joueurSub: Subscription;
  partie: Partie = new Partie();
  partieSub: Subscription;
  equipe1: Equipe = new Equipe();
  equipe2: Equipe = new Equipe();
  equipe1Sub: Subscription;
  equipe2Sub: Subscription;

  joueursTeam1Sub: Subscription;
  joueursTeam1: Joueur[] = new  Array();
  joueursTeam2Sub: Subscription;
  joueursTeam2: Joueur[] = new  Array();

  personnagesCompleteSub: Subscription;
  personnagesComplete: Personnage[] = new  Array();

  destroyed$ = new Subject();

  constructor(private global: GlobalService, public _personnageService: PersonnageService, public _userService: UserService, public _joueurService: JoueurService, public _partieService: PartieService, public _equipeService: EquipeService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') || localStorage.getItem('account')) {
      this.subscribeGameAndConnectToWS();
    }
  }

  subscribeGameAndConnectToWS()  {

    this.global.me = JSON.parse(localStorage.getItem('account'));
    this.userSub = this.global.user.subscribe(
      me => this.account = me
    );
    if (localStorage.getItem('joueur')) {
      this.global.megamer = JSON.parse(localStorage.getItem('joueur'));
      this.joueurSub = this.global.joueur.subscribe(
        megamer => this.joueur = megamer
      );
      this.global.megame = JSON.parse(localStorage.getItem('partie'));
      this.partieSub = this.global.partie.subscribe(
        megame => this.partie = megame
      );
      this.global.meteam1 = JSON.parse(localStorage.getItem('equipe1'));
      this.equipe1Sub = this.global.equipe1.subscribe(
        meteam1 => this.equipe1 = meteam1
      );
      this.global.meteam2 = JSON.parse(localStorage.getItem('equipe2'));
      this.equipe2Sub = this.global.equipe2.subscribe(
        meteam2 => this.equipe2 = meteam2
      );
      this.global.joueurs_team1 = JSON.parse(localStorage.getItem('joueurs_team1'));
      this.joueursTeam1Sub = this.global.joueursTeam1.subscribe(
        joueurs_team1 => this.joueursTeam1 = joueurs_team1
      );
      this.global.joueurs_team2 = JSON.parse(localStorage.getItem('joueurs_team2'));
      this.joueursTeam2Sub = this.global.joueursTeam2.subscribe(
        joueurs_team2 => this.joueursTeam2 = joueurs_team2
      );
      if (localStorage.getItem('liste_personnages')) {
        this.global.melistepersonnagescomplete = JSON.parse(localStorage.getItem('liste_personnages'));
      }
      this.personnagesCompleteSub = this.global.personnagesComplete.subscribe(
        mepersonnagesComplete => this.personnagesComplete = mepersonnagesComplete
      );
      this.connect(this.partie.code_unique);
      this.getTeam1();
      this.getTeam2();
    }
  }

  connect(code) {
    this.account.token = this._userService.token;
    this._partieService.connect(code, this.account.token).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(messages => {
      if (messages.message.requete === 'get_team1') {
        const result = JSON.parse(messages.message.equipe);
        this.majTeam1(result);
      }
      if (messages.message.requete === 'get_team2') {
        const result = JSON.parse(messages.message.equipe);
        this.majTeam2(result);
      }
      if (messages.message.requete === 'majteam') {
        const team1 = JSON.parse(messages.message.equipe1);
        const team2 = JSON.parse(messages.message.equipe2);
        this.majTeam1(team1);
        this.majTeam2(team2);
      }

      if (messages.message.requete === 'letsstartround2') {
        const round1 = StadePartieEnCours.ROUND_1;
        this.partie.stadePartieEnCours = round1;
        this.global.megame = this.partie;
        //< this.router.navigate(['manche']);
      }
    });
  }


  majTeam1(data: any) {
    this.global.joueurs_team1 = [];
    data.forEach(element => {
      const j: Joueur = new Joueur();
      j.id = element.pk;
      j.equipe_id = element.fields.equipe_id;
      j.username = element.fields.username;
      j.owner_id = element.fields.owner;
      j.partiencours = element.fields.partiencours;
      j.readytostart = element.fields.readytostart;
      this.joueursTeam1.push(j);
      if (j.id === this.joueur.id) {
        this.myteam = 1;
      }
    });
    this.global.joueurs_team1 = this.joueursTeam1;
  }
  majTeam2(data: any) {
    this.global.joueurs_team2 = [];
    data.forEach(element => {
      const j: Joueur = new Joueur();
      j.id = element.pk;
      j.equipe_id = element.fields.equipe_id;
      j.username = element.fields.username;
      j.owner_id = element.fields.owner;
      j.partiencours = element.fields.partiencours;
      j.readytostart = element.fields.readytostart;
      this.joueursTeam2.push(j);
      if (j.id === this.joueur.id) {
        this.myteam = 2;
      }
    });
    this.global.joueurs_team2 = this.joueursTeam2;
  }
  getTeam1() {
    this._partieService.send('' , 'get_team1');
  }
  getTeam2() {
    this._partieService.send('' , 'get_team2');
  }

  ngOnDestroy(): void {
    this._partieService.closeConnection();
    this.destroyed$.next();
    this.equipe1Sub.unsubscribe();
    this.partieSub.unsubscribe();
    this.joueurSub.unsubscribe();
    this.equipe2Sub.unsubscribe();
    this.joueursTeam1Sub.unsubscribe();
    this.joueursTeam2Sub.unsubscribe();
    this.userSub.unsubscribe();
    this.personnagesCompleteSub.unsubscribe();
  }

}
