import { Component, OnInit } from '@angular/core';
import {GlobalService} from '../services/global.service';
import {JoueurService} from '../services/joueur.service';
import {Router} from '@angular/router';
import {User} from '../models/user';
import {Subscription} from 'rxjs';
import {map, flatMap, tap, concatMap, take} from 'rxjs/operators';
import {Joueur} from '../models/joueur';
import {PartieService} from '../services/partie.service';
import {Partie} from '../models/partie';
import {Equipe} from '../models/equipe';
import {EquipeService} from '../services/equipe.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-createorjoinpartie',
  templateUrl: './createorjoinpartie.component.html',
  styleUrls: ['./createorjoinpartie.component.css']
})
export class CreateorjoinpartieComponent implements OnInit {
  codeToShare: any;
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

  baseUrl: string = environment.apiUrl;
  private httpOptions: any;

  constructor(private http: HttpClient, private global: GlobalService, public _joueurService: JoueurService, public _partieService: PartieService, public _equipeService: EquipeService, private router: Router) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  ngOnInit(): void {

    if (localStorage.getItem('token') || localStorage.getItem('account')) {
      this.userSub = this.global.user.subscribe(
        me => this.account = me
      );

      this.joueurSub = this.global.joueur.subscribe(
        megamer => this.joueur = megamer
      );
      this.global.megamer = JSON.parse(localStorage.getItem('joueur'));

      this.partieSub = this.global.partie.subscribe(
        megame => this.partie = megame
      );

      this.equipe1Sub = this.global.equipe1.subscribe(
        meteam1 => this.equipe1 = meteam1
      );
      this.equipe2Sub = this.global.equipe2.subscribe(
        meteam2 => this.equipe2 = meteam2
      );
      this.joueursTeam1Sub = this.global.joueursTeam1.subscribe(
        joueurs_team1 => this.joueursTeam1 = joueurs_team1
      );
      this.joueursTeam2Sub = this.global.joueursTeam2.subscribe(
        joueurs_team2 => this.joueursTeam2 = joueurs_team2
      );

      if (history.state.data && history.state.data.creator) {
        this.partie.owner_id = this.account.id;
        this.partie.stadePartieEnCours = 0;
        history.state.data.creator = false;

        this._partieService.createPartie(this.partie)
          .pipe(take(1),
            tap(res => {
                this.partie = res;
                this.joueur.partiencours = res.id;
                this.global.megame = res;
              }),
          concatMap((res: Partie) => this._equipeService.getEquipe(res).pipe(take(1),
            tap(result => {
              if (result[0].nom === '1') {
                this.equipe1 = result[0];
                this.equipe2 = result[1];
              } else if (result[0].nom === '2') {
                this.equipe2 = result[0];
                this.equipe1 = result[1];
              }
              this.joueur.equipe_id = this.equipe1.id;
              this.global.meteam1 = this.equipe1;
              this.global.meteam2 = this.equipe2;
            }),
            concatMap(() => this._joueurService.updatePartielJoueur(this.joueur, {partiencours: res.id, equipe: this.equipe1.id}))
          )
          )).subscribe(res => {
              this.joueur = res;
              this.global.megamer = this.joueur;
              this.joueursTeam1.push(this.joueur);
              this.global.joueurs_team1 = this.joueursTeam1;
              this.global.joueurs_team2 = [];
          });

      }
    }
  }

  GoToTeam1() {
    let x = 0;

    this.joueursTeam2.forEach(j => {
      if (this.joueur.id === j.id) {
        this.joueur.equipe_id = this.equipe1.id;
        this.joueursTeam2.splice(x, 1);
        this.joueursTeam1.push(this.joueur);
        this.global.joueurs_team1 = this.joueursTeam1;
        this.global.joueurs_team2 = this.joueursTeam2;
        this._joueurService.updatePartielJoueur(this.joueur, {equipe: this.equipe1.id}).subscribe();
        this.global.megamer = this.joueur;
      }
      x = x + 1;
    });
  }

  GoToTeam2() {
     let x = 0;

      this.joueursTeam1.forEach(j => {
      if (this.joueur.id === j.id) {
        this.joueur.equipe_id = this.equipe2.id;
        this.joueursTeam1.splice(x, 1);
        this.joueursTeam2.push(this.joueur);
        this.global.joueurs_team1 = this.joueursTeam1;
        this.global.joueurs_team2 = this.joueursTeam2;
        this._joueurService.updatePartielJoueur(this.joueur, {equipe: this.equipe2.id}).subscribe();
        this.global.megamer = this.joueur;
      }
      x = x + 1;
    });
  }
}
