import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../models/user';
import {Subject, Subscription} from 'rxjs';
import {Joueur} from '../models/joueur';
import {Partie} from '../models/partie';
import {Equipe} from '../models/equipe';
import {Personnage} from '../models/personnage';
import {GlobalService} from '../services/global.service';
import {UserService} from '../services/user.service';
import {PartieService} from '../services/partie.service';
import {takeUntil} from 'rxjs/operators';
import {MancheService} from '../services/manche.service';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-manche',
  templateUrl: './manche.component.html',
  styleUrls: ['./manche.component.scss']
})
export class MancheComponent implements OnInit, OnDestroy {
  equipeEnCours: Equipe;
  equipeEnCoursSub: Subscription;
  myteam: number;
  aQuiDeJouer: Joueur = new Joueur();
  aQuiDeJouerSub: Subscription;
  mancheEnCours: number = 1;
  mancheEnCoursSub: Subscription;
  mancheStarted: boolean = false;
  mancheStartedSub: Subscription;
  afficheScore: boolean = false;
  afficheScoreSub: Subscription;
  afficheInterround: boolean = false;
  afficheInterroundSub: Subscription;
  theend: boolean = false;
  teamwin: Equipe;
  egalite: boolean = false;


  indexOfProchainPersonnage: number = 0;
  listePersonnageToGuess: Personnage[] = new Array();
  listePersonnageToGuessSub: Subscription;
  listePersonnageWrong: Personnage[] = new Array();
  listePersonnageGoodT1: Personnage[] = new Array();
  listePersonnageGoodT1Sub: Subscription;
  listePersonnageGoodT2: Personnage[] = new Array();
  listePersonnageGoodT2Sub: Subscription;

  timeLeft: number = 0;
  timeLeftSub: Subscription;
  interval;

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
  joueursTeam1: Joueur[] = new Array();
  joueursTeam2Sub: Subscription;
  joueursTeam2: Joueur[] = new Array();

  joueursTeamCompleteSub: Subscription;
  joueursTeamComplete: Joueur[] = new Array();
  joueursTeamTempSub: Subscription;
  joueursTeamTemp: Joueur[] = new Array();

  personnagesCompleteSub: Subscription;
  personnagesComplete: Personnage[] = new Array();

  destroyed$ = new Subject();

  constructor(private global: GlobalService, public manche: MancheService, public _userService: UserService, public _partieService: PartieService) {}

    ngOnInit(): void {
      if (localStorage.getItem('access_token') || localStorage.getItem('account')) {
        this.subscribeGameAndConnectToWS();
      }
    }
  subscribeGameAndConnectToWS() {

    this.global.me = JSON.parse(localStorage.getItem('account'));
    this.userSub = this.global.user.subscribe(
      me => this.account = me
    );
    this._userService.refreshToken(localStorage.getItem('refresh_token')).subscribe(result => {
      this._userService.updateData(result['access'], result['refresh']);
      this._userService.connected = true;

      localStorage.setItem('access_token', result['access']);
      localStorage.setItem('refresh_token', result['refresh']);
      if (localStorage.getItem('joueur')) {
        this.joueurSub = this.global.joueur.subscribe(
          megamer => this.joueur = megamer
        );
        this.global.megamer = JSON.parse(localStorage.getItem('joueur'));

        this.partieSub = this.global.partie.subscribe(
          megame => this.partie = megame
        );
        this.global.megame = JSON.parse(localStorage.getItem('partie'));

        this.equipe1Sub = this.global.equipe1.subscribe(
          meteam1 => this.equipe1 = meteam1
        );
        this.global.meteam1 = JSON.parse(localStorage.getItem('equipe1'));

        this.equipe2Sub = this.global.equipe2.subscribe(
          meteam2 => this.equipe2 = meteam2
        );
        this.global.meteam2 = JSON.parse(localStorage.getItem('equipe2'));

        this.joueursTeam1Sub = this.global.joueursTeam1.subscribe(
          joueurs_team1 => this.joueursTeam1 = joueurs_team1
        );
        this.joueursTeam2Sub = this.global.joueursTeam2.subscribe(
          joueurs_team2 => this.joueursTeam2 = joueurs_team2
        );
        this.global.joueurs_team1 = JSON.parse(localStorage.getItem('joueurs_team1'));
        this.global.joueurs_team2 = JSON.parse(localStorage.getItem('joueurs_team2'));

        this.personnagesCompleteSub = this.global.personnagesComplete.subscribe(
          mepersonnagesComplete => this.personnagesComplete = mepersonnagesComplete
        );
        if (localStorage.getItem('liste_personnages')) {
          this.global.melistepersonnagescomplete = JSON.parse(localStorage.getItem('liste_personnages'));
        }

        this.equipeEnCoursSub = this.manche.equipeEnCours.subscribe(
          equipeencours => this.equipeEnCours = equipeencours
        );
        if (!localStorage.getItem('equipecourante')) {
          this.manche.equipeCourante = this.equipe1;
        }
        if (localStorage.getItem('equipecourante')) {
          this.manche.equipeCourante = JSON.parse(localStorage.getItem('equipecourante'));
        }
        console.log(this.equipeEnCours);

        this.mancheEnCoursSub = this.manche.mancheEnCours.subscribe(
          manche => this.mancheEnCours = manche
        );
        if (!localStorage.getItem('mancheencours')) {
          this.manche.mancheactuelle = 1;
        }
        if (localStorage.getItem('mancheencours')) {
          this.manche.mancheactuelle = Number(localStorage.getItem('mancheencours'));
        }
        this.mancheStartedSub = this.manche.mancheDemarrer.subscribe(
          manchestart => this.mancheStarted = manchestart
        );
        if (!localStorage.getItem('manchestarted')) {
          this.manche.manchestart = false;
        }
        if (localStorage.getItem('manchestarted')) {
          this.manche.manchestart = JSON.parse(localStorage.getItem('manchestarted'));
        }

        this.listePersonnageGoodT1Sub = this.manche.listePersoGoodT1.subscribe(
          personnageOkT1 => this.listePersonnageGoodT1 = personnageOkT1
        );

        this.listePersonnageGoodT2Sub = this.manche.listePersoGoodT2.subscribe(
          personnageOkT2 => this.listePersonnageGoodT2 = personnageOkT2
        );
        if (!localStorage.getItem('personnagegoodT1')) {
          this.manche.personnageOkT1 = [];
        }
        if (localStorage.getItem('personnagegoodT1')) {
          this.manche.personnageOkT1 = JSON.parse(localStorage.getItem('personnagegoodT1'));
        }
        if (!localStorage.getItem('personnagegoodT2')) {
          this.manche.personnageOkT2 = [];
        }
        if (localStorage.getItem('personnagegoodT2')) {
          this.manche.personnageOkT2 = JSON.parse(localStorage.getItem('personnagegoodT2'));
        }



        this.afficheScoreSub = this.manche.afficheScore.subscribe(
          affichescor => this.afficheScore = affichescor
        );
        if (!localStorage.getItem('affichescore')) {
          this.manche.affichageScore = false;
        }
        if (localStorage.getItem('affichescore')) {
          this.manche.affichageScore = JSON.parse(localStorage.getItem('affichescore'));
        }
        this.afficheInterroundSub = this.manche.afficheInterRound.subscribe(
          afficheint => this.afficheInterround = afficheint
        );
        if (!localStorage.getItem('afficheinterround')) {
          this.manche.affichageInterRound = false;
        }
        if (localStorage.getItem('afficheinterround')) {
          this.manche.affichageInterRound = JSON.parse(localStorage.getItem('afficheinterround'));
        }
        this.listePersonnageToGuessSub = this.manche.listePersoToGuess.subscribe(
          personnagetoguess => this.listePersonnageToGuess = personnagetoguess
        );
        if (!localStorage.getItem('persotoguess')) {
          this.manche.persoToGuess = [];
        }
        if (localStorage.getItem('persotoguess')) {
          this.manche.persoToGuess = JSON.parse(localStorage.getItem('persotoguess'));
        }

        this.joueursTeamCompleteSub = this.manche.joueursTeamComplete.subscribe(
          joueurs_team1Temp => this.joueursTeamComplete = joueurs_team1Temp
        );
        this.joueursTeamTempSub = this.manche.joueursTeamTemp.subscribe(
          joueurs_team2Temp => this.joueursTeamTemp = joueurs_team2Temp
        );
        if (localStorage.getItem('joueurs_teamComplete')) {
          this.manche.joueurs_teamComplete = JSON.parse(localStorage.getItem('joueurs_teamComplete'));
        }
        if (localStorage.getItem('joueurs_teamTemp')) {
          this.manche.joueurs_teamTemp = JSON.parse(localStorage.getItem('joueurs_teamTemp'));
        }
        this.aQuiDeJouerSub = this.manche.aQuiDeJouer.subscribe(
          quijoue => this.aQuiDeJouer = quijoue
        );
        if (localStorage.getItem('aquidejouer')) {
          this.manche.quijoue = JSON.parse(localStorage.getItem('aquidejouer'));;
        }
        if (localStorage.getItem('timer')) {
          this.manche.timerseconde = Number(localStorage.getItem('timer'));
          //this.startTimer();
        }
        this.timeLeftSub = this.manche.timer.subscribe(
          time => this.timeLeft = time
        );
        if (!localStorage.getItem('timer')) {
          this.manche.timerseconde = 0;
        }
        this.connect(this.partie.code_unique);
        //this.getTeam1();
        //this.getTeam2();
        this.getNextPlayer();
      }
    });

  }
  pause() {
    clearInterval(this.interval);
  }
  resume() {
    this.startTimer();
  }
  startTimer() {
    this.manche.affichageInterRound = false;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.manche.timerseconde = this.timeLeft;
      } else if (this.timeLeft === 0) {
        clearInterval(this.interval);
        if (this.aQuiDeJouer.owner_id === this.account.id) {
          setTimeout(() => {
            if (this.listePersonnageToGuess.length > 0) {
              const data = {};
              this.manche.manchestart = false;
              this.manche.affichageScore = true;
              this.listePersonnageWrong.push(this.listePersonnageToGuess[0]);
              const persoTemp = this.listePersonnageToGuess[0];
              this.listePersonnageToGuess.splice(0, 1);
              this.listePersonnageToGuess.push(persoTemp);
              this.manche.persoToGuess = this.listePersonnageToGuess;
              data["listePersonnageToGuess"] = this.listePersonnageToGuess;
              data["currentteam"] = this.equipeEnCours.nom;
              data["currentround"] = this.mancheEnCours;
              data["jteamcomplete"] = this.joueursTeamComplete;
              data["jteamtemp"] = this.joueursTeamTemp;
              data["liste_personnages"] = this.personnagesComplete;
              this._partieService.send(data, 'nextplayersameround', this._userService.access_token);
            } else if (this.listePersonnageToGuess.length === 0) { // si on arrive à la fin de la liste
              this.endround();
            }
          }, 3000);
        } else {
          setTimeout(() => {

          },  500);
        }
      }
    }, 1000);
  }
  getNextPlayer() {
    if (!localStorage.getItem('aquidejouer') && this.account.id === this.partie.owner_id) {
      this._partieService.send('0', 'getnextplayer', this._userService.access_token);
    } else if (localStorage.getItem('aquidejouer') && this.account.id === this.partie.owner_id) {
     /* const data = {};
      data["listePersonnageToGuess"] = this.listePersonnageToGuess;
      data["currentteam"] = this.equipeEnCours.nom;
      data["currentround"] = this.mancheEnCours;
      data["jteamcomplete"] = this.joueursTeamComplete;
      data["jteamtemp"] = this.joueursTeamTemp;
      this._partieService.send(data, 'nextplayersameround');*/
    }
  }
  nextName() {
    if (this.equipeEnCours.nom === "1") {
      this.listePersonnageGoodT1.push(this.listePersonnageToGuess[0]);
      this.manche.personnageOkT1 = this.listePersonnageGoodT1;
      this._partieService.send(this.listePersonnageGoodT1,"majScoret1", this._userService.access_token);
    }
    if (this.equipeEnCours.nom === "2" ) {
      this.listePersonnageGoodT2.push(this.listePersonnageToGuess[0]);
      this.manche.personnageOkT2 = this.listePersonnageGoodT2;
      this._partieService.send(this.listePersonnageGoodT2,"majScoret2", this._userService.access_token);
    }
    this.listePersonnageToGuess.splice(0, 1);
    this.manche.persoToGuess = this.listePersonnageToGuess;
    if (this.listePersonnageToGuess.length === 0) { // si on arrive à la fin de la liste
      this.pause();
      this.endround();
    }
  }

  wrong() {
    this.listePersonnageWrong.push(this.listePersonnageToGuess[0]);
    const persoTemp = this.listePersonnageToGuess[0];
    this.listePersonnageToGuess.splice(0, 1);
    this.listePersonnageToGuess.push(persoTemp);
    this.manche.persoToGuess = this.listePersonnageToGuess;
  }

  startround() {

    if (this.listePersonnageToGuess.length > 0) {
      this._partieService.send(this.listePersonnageToGuess, 'startround1', this._userService.access_token);
    } else if (this.listePersonnageToGuess.length === 0) {
      this._partieService.send('', 'startround1', this._userService.access_token);
    }
  }

  endround() {
    if ((this.mancheEnCours +  1) === 4) { // si on arrive à la fin du jeu
      const data = {};
      data["egalite"] = false;
      data["score2"] = this.listePersonnageGoodT2.length;
      data["score1"] = this.listePersonnageGoodT1.length;
      if (data["score1"] > data["score2"]) {
        data["equipegagnante"] = this.equipe1;
      } else if (data["score2"] > data["score1"]) {
        data["equipegagnante"] = this.equipe2;
      } else if (data["score1"] === data["score2"]) {
        data["egalite"] = true;
      }
      this._partieService.send(data, "theend", this._userService.access_token);
    } else { // si on passe au round suivant
      const data = {};
      data["listePersonnageToGuess"] = this.listePersonnageToGuess;
      data["currentteam"] = this.equipeEnCours.nom;
      data["currentround"] = this.mancheEnCours;
      data["jteamcomplete"] = this.joueursTeamComplete;
      data["jteamtemp"] = this.joueursTeamTemp;
      data["liste_personnages"] = this.shuffle(this.personnagesComplete);
      this._partieService.send(data,'nextround', this._userService.access_token);
    }
  }
  connect(code) {
    this.account.access_token = this._userService.access_token;
    this._partieService.connect(code, this.account.access_token).pipe(
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
      if (messages.message.requete === 'startround1') {
        if ((this.aQuiDeJouer.owner_id === this.account.id) && (!this.mancheStarted && !this.afficheScore)) {
          this.manche.persoToGuess = this.shuffle(this.personnagesComplete);
        } else {
          this.global.melistepersonnagescomplete = this.personnagesComplete;
        }

        this.manche.affichageScore = false;
        this.manche.manchestart = true;
        this.manche.affichageInterRound = false;
        this.manche.timerseconde = 30;

        this.indexOfProchainPersonnage = 0;
        this.startTimer();
      }
      if (messages.message.requete === 'nextround') {
        this.pause();
        this.manche.timerseconde = 0;
        this.manche.manchestart = false;
        this.manche.affichageScore = true;
        this.manche.affichageInterRound = true;
        const player = new Joueur();
        player.id = messages.message.quijoue.pk;
        player.equipe_id = messages.message.quijoue.fields.equipe;
        player.owner_id = messages.message.quijoue.fields.owner;
        player.username = messages.message.quijoue.fields.username;
        player.equipe_id = messages.message.quijoue.fields.equipe;
        player.partiencours = messages.message.quijoue.fields.partiencours;
        player.readytostart = messages.message.quijoue.fields.readytostart;
        this.manche.quijoue = player;

        if (this.aQuiDeJouer.equipe_id === this.equipe1.id) {
          this.manche.equipeCourante = this.equipe1;
        }
        if (this.aQuiDeJouer.equipe_id === this.equipe2.id) {
          this.manche.equipeCourante = this.equipe2;
        }
        this.manche.joueurs_teamComplete = messages.message.jteamcomplete;
        this.manche.joueurs_teamTemp = messages.message.jteamtemp;
        this.manche.mancheactuelle = JSON.parse(messages.message.currentround);
        this.manche.persoToGuess = messages.message.listePersonnageToGuess;
        this.global.melistepersonnagescomplete = this.personnagesComplete;
      }
      if (messages.message.requete === 'getnextplayer') {
        if  (!localStorage.getItem("aquidejouer")) {
          const player = new Joueur();
          player.id = messages.message.quijoue.pk;
          player.equipe_id = messages.message.quijoue.fields.equipe;
          player.owner_id = messages.message.quijoue.fields.owner;
          player.username = messages.message.quijoue.fields.username;
          player.equipe_id = messages.message.quijoue.fields.equipe;
          player.partiencours = messages.message.quijoue.fields.partiencours;
          player.readytostart = messages.message.quijoue.fields.readytostart;
          this.manche.quijoue = player;

          if (this.aQuiDeJouer.equipe_id === this.equipe1.id) {
            this.manche.equipeCourante = this.equipe1;
          }
          if (this.aQuiDeJouer.equipe_id === this.equipe2.id) {
            this.manche.equipeCourante = this.equipe2;
          }
          this.manche.joueurs_teamComplete = messages.message.jteamcomplete;
          this.manche.joueurs_teamTemp = messages.message.jteamtemp;
          this.global.melistepersonnagescomplete = this.personnagesComplete;
        }
      }

      if (messages.message.requete === 'majScoret1') {
        this.manche.personnageOkT1 = messages.message.score1;
      }
      if (messages.message.requete === 'majScoret2') {
        this.manche.personnageOkT2 = messages.message.score2;
      }
      if (messages.message.requete === 'nextplayersameround') {
        const player = new Joueur();
        player.id = messages.message.quijoue.pk;
        player.equipe_id = messages.message.quijoue.fields.equipe;
        player.owner_id = messages.message.quijoue.fields.owner;
        player.username = messages.message.quijoue.fields.username;
        player.partiencours = messages.message.quijoue.fields.partiencours;
        player.readytostart = messages.message.quijoue.fields.readytostart;
        this.manche.quijoue = player;

        if (this.aQuiDeJouer.equipe_id === this.equipe1.id) {
          this.manche.equipeCourante = this.equipe1;
        }
        if (this.aQuiDeJouer.equipe_id === this.equipe2.id) {
          this.manche.equipeCourante = this.equipe2;
        }
        this.manche.joueurs_teamComplete = messages.message.jteamcomplete;
        this.manche.joueurs_teamTemp = messages.message.jteamtemp;
        this.manche.manchestart = false;
        this.manche.affichageScore = true;
        this.manche.persoToGuess = messages.message.listePersonnageToGuess;
        this.global.melistepersonnagescomplete = this.personnagesComplete;
      }
      if (messages.message.requete === 'theend') {
        this.theend = true;
        this.egalite = messages.message.egalite;
        if (!this.egalite) {
          this.teamwin = messages.message.equipegagnante;
        }
      }
    });
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
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  getTeam1() {
    this._partieService.send('', 'get_team1', this._userService.access_token);
  }
  getTeam2() {
    this._partieService.send('', 'get_team2', this._userService.access_token);
  }
  ngOnDestroy(): void {
    this._partieService.closeConnection();
    this.destroyed$.next(undefined);
    this.equipe1Sub.unsubscribe();
    this.partieSub.unsubscribe();
    this.joueurSub.unsubscribe();
    this.equipe2Sub.unsubscribe();
    this.joueursTeam1Sub.unsubscribe();
    this.joueursTeam2Sub.unsubscribe();
    this.userSub.unsubscribe();
    this.personnagesCompleteSub.unsubscribe();
    this.mancheEnCoursSub.unsubscribe();
    this.mancheStartedSub.unsubscribe();
    this.aQuiDeJouerSub.unsubscribe();
    this.equipeEnCoursSub.unsubscribe();
    this.listePersonnageGoodT1Sub.unsubscribe();
    this.listePersonnageGoodT2Sub.unsubscribe();
    this.listePersonnageToGuessSub.unsubscribe();
    this.timeLeftSub.unsubscribe();
    this.joueursTeamCompleteSub.unsubscribe();
    this.joueursTeamTempSub.unsubscribe();
    this.afficheInterroundSub.unsubscribe();
    //localStorage.setItem('cantcomeback', 'true');
  }
}
