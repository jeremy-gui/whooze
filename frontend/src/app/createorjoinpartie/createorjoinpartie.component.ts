import {Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalService} from '../services/global.service';
import {JoueurService} from '../services/joueur.service';
import {Router} from '@angular/router';
import {User} from '../models/user';
import {Subject, Subscription} from 'rxjs';
import {concatMap, take, takeUntil, tap} from 'rxjs/operators';
import {Joueur} from '../models/joueur';
import {PartieService} from '../services/partie.service';
import {Partie, StadePartieEnCours} from '../models/partie';
import {Equipe} from '../models/equipe';
import {EquipeService} from '../services/equipe.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Message} from '@angular/compiler/src/i18n/i18n_ast';
import {FormControl} from '@angular/forms';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-createorjoinpartie',
  templateUrl: './createorjoinpartie.component.html',
  styleUrls: ['./createorjoinpartie.component.css']
})
export class CreateorjoinpartieComponent implements OnInit, OnDestroy {
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
  messages: Message[] = [];
  msgCtrl = new FormControl('');
  destroyed$ = new Subject();
  messageErreur: string = '';

  baseUrl: string = environment.apiUrl;
  private httpOptions: any;

  constructor(private http: HttpClient, private global: GlobalService, public _userService: UserService, public _joueurService: JoueurService, public _partieService: PartieService, public _equipeService: EquipeService, private router: Router) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  ngOnInit(): void {


    if (localStorage.getItem('access_token') || localStorage.getItem('account')) {

        this.global.me = JSON.parse(localStorage.getItem('account'));
        this.userSub = this.global.user.subscribe(
          me => this.account = me
        );
        this._userService.refreshToken(localStorage.getItem('refresh_token')).subscribe(result => {
          this._userService.updateData(result['access'], result['refresh']);
          this._userService.connected = true;

          localStorage.setItem('access_token', result['access']);
          localStorage.setItem('refresh_token', result['refresh']);
          if (localStorage.getItem('partie')) {
            this.subscribeGame();
          }
        });


        if (localStorage.getItem('joueur')) {
          this.global.megamer = JSON.parse(localStorage.getItem('joueur'));
          this.joueurSub = this.global.joueur.subscribe(
            megamer => this.joueur = megamer
          );
        }


        // si le joueur est le createur de la partie
        if (history.state.data && history.state.data.creator) {
        this.partie.owner_id = this.account.id;
        this.partie.stadePartieEnCours = StadePartieEnCours.CREATE_TEAMS;
        history.state.data.creator = false;

        this._partieService.createPartie(this.partie)
          .pipe(take(1),
            tap(res => {
                this.partie = res;
                this.partie.owner_id = res.owner.id;
                this.joueur.partiencours = this.partie.id;
                this.global.megame = this.partie;
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
            concatMap(() => this._joueurService.updatePartielJoueur(this.joueur, {partiencours: this.partie.id, equipe: this.equipe1.id}))
          )
          )).subscribe(res => {
              this.joueur = res;
              this.global.megamer = this.joueur;
              this.joueursTeam1.push(this.joueur);
              this.global.joueurs_team1 = this.joueursTeam1;
              this.global.joueurs_team2 = [];
              this.subscribeGame();
              this.connect(this.partie.code_unique);
          });

      }
      // fin du createur de la partie

      // si le joueur rejoins une partie déjà créé

        else if ((history.state.data && history.state.data.partieid) || localStorage.getItem('partie')) {
          let idpartie;
          if (history.state.data && history.state.data.partieid) {
            idpartie = history.state.data.partieid;
            history.state.data.partieid = null;
          }  else if (localStorage.getItem('partie')) {
            idpartie = JSON.parse(localStorage.getItem('partie')).id;
          }
          this._partieService.getPartieFromId(idpartie).pipe(take(1),
          tap(res => {
            this.partie = res;
            this.joueur.partiencours = res.id;
            this.partie.owner_id = res.owner.id;
            localStorage.setItem('partie', JSON.stringify(res));
            this.subscribeGame();
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
              if (JSON.parse(localStorage.getItem('joueur')).equipe) {
                this.joueur.equipe_id = JSON.parse(localStorage.getItem('joueur')).equipe;
                this.global.megamer = this.joueur;
                if (this.joueur.equipe_id === this.equipe1.id) {
                  this.GoToTeam1(false);
                } else if (this.joueur.equipe_id === this.equipe2.id) {
                  this.GoToTeam2(false);
                }
              } else {
                this.joueur.equipe_id = this.equipe1.id;
              }
              this.global.meteam1 = this.equipe1;
              this.global.meteam2 = this.equipe2;
            }),
            concatMap(() => this._joueurService.updatePartielJoueur(this.joueur, {partiencours: this.partie.id, equipe: this.equipe1.id}))
            )
          )).subscribe(res => {
          this.joueur = res;
          this.getTeam1();
          this.getTeam2();
        });
      }

    }
  }

  GoToTeam1(getteam = true) {
    this._joueurService.updatePartielJoueur(this.joueur, {equipe: this.equipe1.id}).subscribe(result => {
      this.global.megamer = result;
      if (getteam) {
        this.getTeam1();
        this.getTeam2();
      }
    });

  /*  let x = 0;

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
    });*/
  }

  GoToTeam2(getteam = true) {
    this._joueurService.updatePartielJoueur(this.joueur, {equipe: this.equipe2.id}).subscribe(result => {
      this.global.megamer = result;
      if (getteam) {
        this.getTeam1();
        this.getTeam2();
      }
    });
  }

  subscribeGame()  {
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
    if (this.partie.code_unique) {
      this.connect(this.partie.code_unique);
      this.getTeam1();
      this.getTeam2();
    }
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
  }

  connect(code) {
    this.account.access_token = this._userService.access_token;

    this._partieService.connect(code, this.account.access_token).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(messages => {
      if (messages.message.requete === 'get_team1') {
         if (messages.message.newpartie === 'True') { //si le craeteur a quitter la partie et que ce joueur reprends le owner
           this._partieService.getPartieFromId(this.partie.id).subscribe(res => {
             this.partie = res;
             this.partie.owner_id = res.owner.id;
             this.global.megame = this.partie;

           });
         }
          const result = JSON.parse(messages.message.equipe);
            this.global.joueurs_team1 = [];
            result.forEach(element => {
            let j: Joueur = new Joueur();
            j.id = element.pk;
            j.equipe_id = element.fields.equipe_id;
            j.username = element.fields.username;
            j.owner_id = element.fields.owner_id;
            j.partiencours = element.fields.partiencours;
            j.readytostart = element.fields.readytostart;
            this.joueursTeam1.push(j);
          });
          this.global.joueurs_team1 = this.joueursTeam1;
      }
      if (messages.message.requete === 'get_team2') {
        const result = JSON.parse(messages.message.equipe);
        this.global.joueurs_team2 = [];
        result.forEach(element => {
          let j: Joueur = new Joueur();
          j.id = element.pk;
          j.equipe_id = element.fields.equipe_id;
          j.username = element.fields.username;
          j.owner_id = element.fields.owner_id;
          j.partiencours = element.fields.partiencours;
          j.readytostart = element.fields.readytostart;
          this.joueursTeam2.push(j);
        });
        this.global.joueurs_team2 = this.joueursTeam2;
      }
      if (messages.message.requete === 'letscreateperso') {

        const choose = StadePartieEnCours.CHOOSE_PERSO;
        this.partie.stadePartieEnCours = choose;
        this.global.megame = this.partie;
        this.router.navigate(['createperso']);
      }


    });
  }
  getTeam1() {
    this._partieService.send("" , "get_team1", this._userService.access_token);
  }
  getTeam2() {
    this._partieService.send("" , "get_team2", this._userService.access_token);
  }
  sendMessage() {
    this.account.refresh_token = this._userService.refresh_token;
    this.account.access_token = this._userService.access_token;
    this._partieService.send(this.msgCtrl.value , "message", this._userService.access_token);
    this.msgCtrl.setValue('');
  }

  StartGame() {
    let error = false;
    if ((this.joueursTeam1.length + this.joueursTeam2.length) < 4) {
        this.messageErreur = 'The number of players must be 4 at least';
        error = true;
    } else if (this.joueursTeam1.length < 2 || this.joueursTeam2.length < 2) {
        this.messageErreur = 'The number of players per team must be 2 at least';
        error = true;
    }
    if (!error) {
      this._partieService.send('', 'letscreateperso', this._userService.access_token);
    }
  }
}
