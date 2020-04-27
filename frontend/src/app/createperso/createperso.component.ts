import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../models/user';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {Joueur} from '../models/joueur';
import {Partie, StadePartieEnCours} from '../models/partie';
import {CustomValidators} from '../utils/custom-validators';
import {Equipe} from '../models/equipe';
import {GlobalService} from '../services/global.service';
import {UserService} from '../services/user.service';
import {JoueurService} from '../services/joueur.service';
import {PartieService} from '../services/partie.service';
import {EquipeService} from '../services/equipe.service';
import {Router} from '@angular/router';
import {Message} from '@angular/compiler/src/i18n/i18n_ast';
import {environment} from '../../environments/environment';
import {HttpHeaders} from '@angular/common/http';
import {takeUntil} from 'rxjs/operators';
import {Personnage} from '../models/personnage';
import {PersonnageService} from '../services/personnage.service';

@Component({
  selector: 'app-createperso',
  templateUrl: './createperso.component.html',
  styleUrls: ['./createperso.component.scss']
})
export class CreatepersoComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  submitted = false;
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

  personnagesSub: Subscription;
  personnages: Personnage[] = new  Array();
  personnagesCompleteSub: Subscription;
  personnagesComplete: Personnage[] = new  Array();

  ready: boolean = false;
  erreurNbr: boolean = false;
  messages: Message[] = [];
  msgCtrl = new FormControl('');
  destroyed$ = new Subject();
  messageErreur: string = '';
  ownercanstart: boolean = false;
  myteam: number;

  private httpOptions: any;

  constructor(private formBuilder: FormBuilder, private global: GlobalService, public _personnageService: PersonnageService, public _userService: UserService, public _joueurService: JoueurService, public _partieService: PartieService, public _equipeService: EquipeService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') || localStorage.getItem('account')) {
      this.registerForm = this.formBuilder.group({
        nom: [null, Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20)
          ])
        ],
      });

      this.subscribeGameAndConnectToWS();

    }
  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

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
    }

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
    if (localStorage.getItem('personnages')) {
      this.global.mepersonnages = JSON.parse(localStorage.getItem('personnages'));
    }
    this.personnagesSub = this.global.personnages.subscribe(
      mepersonnages => this.personnages = mepersonnages
    );
    if (localStorage.getItem('liste_personnages')) {
      this.global.melistepersonnagescomplete = JSON.parse(localStorage.getItem('liste_personnages'));
    }
    if (environment.debug === true) {

    }
    this.personnagesCompleteSub = this.global.personnagesComplete.subscribe(
      mepersonnagesComplete => this.personnagesComplete = mepersonnagesComplete
    );
    if (environment.debug === true) {

    }
    this.connect(this.partie.code_unique);
    this.getTeam1();
    this.getTeam2();

    if (this.personnages.length === 10) {
      this.ready = true;
      this.verifOwnerCanStart();
    } else {
      this.ready = false;
      this.ownercanstart = false;
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
        this.verifOwnerCanStart();

      }
      if (messages.message.requete === 'listepersocomplete') {
        const listPersonnage = JSON.parse(messages.message.liste);
        this.global.melistepersonnagescomplete = [];
        listPersonnage.forEach(element => {
          const p: Personnage = new Personnage();
          p.id = element.pk;
          p.playerowner = element.fields.playerowner;
          p.nom = element.fields.nom;
          this.personnagesComplete.push(p);
        });
        this.global.melistepersonnagescomplete = this.personnagesComplete;
        this._partieService.send('', 'letsstartround1');
      }
      if (messages.message.requete === 'letsstartround1') {
        const round1 = StadePartieEnCours.ROUND_1;
        this.partie.stadePartieEnCours = round1;
        this.global.megame = this.partie;
        this.router.navigate(['manche']);
      }
    });
  }
  verifOwnerCanStart() {
    if (this.account.id === this.partie.owner_id) {
      const nombreJoueurTotal = this.joueursTeam1.length + this.joueursTeam2.length;
      let nombreJoueurPret: number = 0;
      this.joueursTeam1.forEach(element => {
        if (element.readytostart === true) {
          nombreJoueurPret += 1;
        }
      });
      this.joueursTeam2.forEach(element => {
        if (element.readytostart === true) {
          nombreJoueurPret += 1;
        }
      });
      if (nombreJoueurPret === nombreJoueurTotal) {
        this.ownercanstart = true;
      }
      else {
        this.ownercanstart = false;
      }
    }
  }
  startthegame() {
    this._partieService.send('', "listepersocomplete");
  }

  majTeam1(data: any) {
    this.global.joueurs_team1 = [];
    data.forEach(element => {
      let j: Joueur = new Joueur();
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
      let j: Joueur = new Joueur();
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
    this._partieService.send("" , "get_team1");
  }
  getTeam2() {
    this._partieService.send("" , "get_team2");
  }
  ErreurNombrePerso() {
    if (this.personnages.length >= 10) {
      return this.erreurNbr = true;
    } else {
      return this.erreurNbr = false;
    }
  }
  readytoplay(cancel = false) {
    if (this.personnages.length === 10 && cancel === false) {
        this.joueur.readytostart = true;
        this.global.megamer = this.joueur;
        this._partieService.send(true , "readytostart");
    } else  if (this.personnages.length === 10 && cancel === true) {
      this.joueur.readytostart = false;
      this.global.megamer = this.joueur;
      this._partieService.send(false , "readytostart");
    } else {
      this.ErreurNombrePerso();
      this.joueur.readytostart = false;
      return;
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    } else if (!this.ErreurNombrePerso()) {
      let perso = new Personnage();
      perso.nom = this.f.nom.value;
      perso.playerowner = this.joueur.id;
      this._personnageService.createPersonnage(perso).subscribe(
        data => {
          perso.id = data.id;
          this.personnages.push(perso);
          localStorage.setItem('personnages', JSON.stringify(this.personnages));
          this.global.mepersonnages = this.personnages;
          this.f.nom.setValue("");
          this.submitted = false;
          if (this.personnages.length === 10) {
            this.ready = true;
          } else {
            this.ready = false;
          }
        },
        error => {
          console.log(error);
          return;
        }
      );
    }
  }

  deletePerso(perso: Personnage) {
    this._personnageService.deletePersonnage(perso).subscribe(
      data => {
        const index = this.personnages.indexOf(perso);
        if (index !== -1) {
          this.personnages.splice(index, 1);
        }
        localStorage.setItem('personnages', JSON.stringify(this.personnages));
        this.global.mepersonnages = this.personnages;
        this.ErreurNombrePerso();
        if (this.personnages.length === 10) {
          this.ready = true;
        } else {
          this.joueur.readytostart = false;
          this.ready = false;
        }
      },
      error => {
        console.log(error);
        return;
      }
    );
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
