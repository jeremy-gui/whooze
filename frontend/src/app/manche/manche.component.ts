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
import {MancheService} from '../services/manche.service';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';

@Component({
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
  mancheEnCours: number = 1; //de 1 à 3
  mancheEnCoursSub: Subscription;
  indexJoueurEquipe1: number = 0;
  indexJoueurEquipe1Sub: Subscription;
  indexJoueurEquipe2: number = 0;
  indexJoueurEquipe2Sub: Subscription;
  mancheStarted: boolean = false;
  mancheStartedSub: Subscription;
  afficheScore: boolean = false;
  afficheScoreSub: Subscription;

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

  personnagesCompleteSub: Subscription;
  personnagesComplete: Personnage[] = new Array();

  destroyed$ = new Subject();

  constructor(private global: GlobalService, public manche: MancheService, public _personnageService: PersonnageService, public _userService: UserService, public _joueurService: JoueurService, public _partieService: PartieService, public _equipeService: EquipeService, private router: Router) {}

    ngOnInit(): void {
      if (localStorage.getItem('token') || localStorage.getItem('account')) {
        this.subscribeGameAndConnectToWS();
      }
    }

    defineNextPlayer() {
      switch (this.mancheEnCours) {
        case 1 :
            if (this.equipeEnCours.nom === '1') {
              this.indexJoueurEquipe1++;
              this.manche.indexjequipe1 = this.indexJoueurEquipe1;
              this.manche.equipeCourante = this.equipe2;
              this.manche.quijoue = this.joueursTeam2[this.indexJoueurEquipe2];
            } else if (this.equipeEnCours.nom === '2') {
              this.indexJoueurEquipe2++;
              this.manche.indexjequipe2 = this.indexJoueurEquipe2;
              this.manche.equipeCourante = this.equipe1;
              this.manche.quijoue = this.joueursTeam1[this.indexJoueurEquipe1];
            }
          break;
        case 2:
          break;
        case 3:
          break;
        default:
          return;
      }
    }

    miseEnPlaceMancheSuivante() {
        switch (this.mancheEnCours) {
          case 1 :

            break;
          case 2:
            break;
          case 3:
            break;
          default:
            return;
        }
    }


    subscribeGameAndConnectToWS() {

      this.global.me = JSON.parse(localStorage.getItem('account'));
      this.userSub = this.global.user.subscribe(
        me => this.account = me
      );
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
        this.listePersonnageToGuessSub = this.manche.listePersoToGuess.subscribe(
          personnagetoguess => this.listePersonnageToGuess = personnagetoguess
        );
        if (!localStorage.getItem('persotoguess')) {
          this.manche.persoToGuess = [];
        }
        if (localStorage.getItem('persotoguess')) {
          this.manche.persoToGuess = JSON.parse(localStorage.getItem('persotoguess'));
        }
        this.indexJoueurEquipe1Sub = this.manche.indexJoueurEquipe1.subscribe(
          index => this.indexJoueurEquipe1 = index
        );
        if (localStorage.getItem('indexjoueurequipe1')) {
          this.manche.indexjequipe1 = Number(localStorage.getItem('indexjoueurequipe1'));
        }
        if (!localStorage.getItem('indexjoueurequipe1')) {
          this.manche.indexjequipe1 = 0;
        }
        this.indexJoueurEquipe2Sub = this.manche.indexJoueurEquipe2.subscribe(
          index => this.indexJoueurEquipe2 = index
        );
        if (localStorage.getItem('indexjoueurequipe2')) {
          this.manche.indexjequipe2 = Number(localStorage.getItem('indexjoueurequipe2'));
        }

        if (!localStorage.getItem('indexjoueurequipe2')) {
          this.manche.indexjequipe2 = 0;
        }

        this.aQuiDeJouerSub = this.manche.aQuiDeJouer.subscribe(
          quijoue => this.aQuiDeJouer = quijoue
        );
        if (localStorage.getItem('aquidejouer')) {
          this.manche.quijoue = JSON.parse(localStorage.getItem('aquidejouer'));;
        }
        if (localStorage.getItem('timer')) {
          this.manche.timerseconde = Number(localStorage.getItem('timer'));
        }
        this.timeLeftSub = this.manche.timer.subscribe(
          time => this.timeLeft = time
        );
        if (!localStorage.getItem('timer')) {
          this.manche.timerseconde = 0;
        }
        this.connect(this.partie.code_unique);
        this.getTeam1();
        this.getTeam2();
        this.getNextPlayer();
      }
    }
    getNextPlayer() {
      if (!localStorage.getItem('aquidejouer') && this.account.id === this.partie.owner_id) {
        this._partieService.send('0', 'getnextplayer');
      } else if (localStorage.getItem('aquidejouer') && this.account.id === this.partie.owner_id) {
        const data = [];
        data["indexJoueurEquipe1"] = this.indexJoueurEquipe1;
        data["indexJoueurEquipe2"] = this.indexJoueurEquipe2
        data["currentteam"] = this.equipeEnCours.nom;
        data["currentround"] = this.mancheEnCours;
        this._partieService.send(data, 'getnextplayer');
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
        if (messages.message.requete === 'startround1') {
          if ((this.aQuiDeJouer.owner_id === this.account.id) && (!this.mancheStarted && !this.afficheScore)) {
            this.manche.persoToGuess = this.shuffle(this.personnagesComplete);
          }
          this.manche.affichageScore = false;
          this.manche.manchestart = true;
          this.manche.timerseconde = 30;
          this.indexOfProchainPersonnage = 0;
        }
        if (messages.message.requete === 'getnextplayer') {
          const player = new Joueur();
          player.id = messages.message.quijoue.pk;
          player.equipe_id = messages.message.quijoue.fields.equipe;
          player.owner_id = messages.message.quijoue.fields.owner;
          player.username = messages.message.quijoue.fields.username;
          player.equipe_id = messages.message.quijoue.fields.equipe;
          player.partiencours = messages.message.quijoue.fields.partiencours;
          player.readytostart = messages.message.quijoue.fields.readytostart;
          this.manche.quijoue = player;

          console.log('l318 aQuiDeJouer'+this.aQuiDeJouer.username);
          if (this.aQuiDeJouer.equipe_id === this.equipe1.id) {
            this.manche.equipeCourante = this.equipe1;
          }
          if (this.aQuiDeJouer.equipe_id === this.equipe2.id) {
            this.manche.equipeCourante = this.equipe2;
          }
          this.manche.indexjequipe1 = JSON.parse(messages.message.indexJoueurEquipe1);
          this.manche.indexjequipe2 = JSON.parse(messages.message.indexJoueurEquipe2);
        }
        if (messages.message.requete === 'majScoret1') {
          this.manche.personnageOkT1 = messages.message.score1;
        }
        if (messages.message.requete === 'majScoret2') {
          this.manche.personnageOkT2 = messages.message.score2;
        }
        if (messages.message.requete === 'nextplayersameround') {
          if (messages.message.data && this.aQuiDeJouer.owner_id === this.account.id) {
            this.getNextPlayer();
            this.manche.persoToGuess = this.shuffle(messages.message.data);
          }
          this.manche.manchestart = false;
          this.manche.affichageScore = true;
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
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.manche.timerseconde = this.timeLeft;
      } else if (this.timeLeft === 0) {
        clearInterval(this.interval);
        setTimeout(() => {
          if (this.listePersonnageToGuess.length > 0 && this.aQuiDeJouer.owner_id === this.account.id) {
            this._partieService.send(this.listePersonnageToGuess,'nextplayersameround');
          }
        }, 3000);
      }
    }, 1000);
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

    nextRound() {
      clearInterval(this.interval);
      this.indexOfProchainPersonnage = 0;
      //defineNextPlayer & nextTeam, nextroundnumber
      //send letsstartroundX
      //index joueur 0
    }



    nextName() {
      if (this.equipeEnCours.nom === "1") {
        this.listePersonnageGoodT1.push(this.listePersonnageToGuess[this.indexOfProchainPersonnage]);
        this.manche.personnageOkT1 = this.listePersonnageGoodT1;
        this._partieService.send(this.listePersonnageGoodT1,"majScoret1");
      }
      if (this.equipeEnCours.nom === "2") {
        this.listePersonnageGoodT2.push(this.listePersonnageToGuess[this.indexOfProchainPersonnage]);
        this.manche.personnageOkT2 = this.listePersonnageGoodT2;
        this._partieService.send(this.listePersonnageGoodT2,"majScoret2");
      }
      this.listePersonnageToGuess.splice(this.indexOfProchainPersonnage, 1);
      this.manche.persoToGuess = this.listePersonnageToGuess;
      if (this.listePersonnageToGuess.length === 0) {
        if (this.equipeEnCours.nom === "1") {
          this._partieService.send(this.listePersonnageGoodT1,"majScoret1");
        }
        if (this.equipeEnCours.nom === "2") {
          this._partieService.send(this.listePersonnageGoodT2,"majScoret2");
        }
        this._partieService.send('','nextround');
      } else if (this.listePersonnageToGuess.length === (this.indexOfProchainPersonnage + 1)) {
        this.indexOfProchainPersonnage = 0;
      }
    }

    wrong() {
      this.listePersonnageWrong.push(this.listePersonnageToGuess[this.indexOfProchainPersonnage]);
      if (this.listePersonnageToGuess.length === (this.indexOfProchainPersonnage + 1)) {
        this.indexOfProchainPersonnage = 0;
      } else {
        this.indexOfProchainPersonnage++;
      }
    }

    startround(manchetostart: number) {

      if (this.afficheScore) {
        this._partieService.send(this.listePersonnageToGuess, 'startround' + manchetostart);
      } else if (!this.afficheScore && !this.mancheStarted) {
        this._partieService.send('', 'startround' + manchetostart);
      }
    }

    getTeam1() {
      this._partieService.send('', 'get_team1');
    }
    getTeam2() {
      this._partieService.send('', 'get_team2');
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
      this.mancheEnCoursSub.unsubscribe();
      this.mancheStartedSub.unsubscribe();
      this.aQuiDeJouerSub.unsubscribe();
      this.equipeEnCoursSub.unsubscribe();
      this.listePersonnageGoodT1Sub.unsubscribe();
      this.listePersonnageGoodT2Sub.unsubscribe();
      this.listePersonnageToGuessSub.unsubscribe();
      this.indexJoueurEquipe1Sub.unsubscribe();
      this.indexJoueurEquipe2Sub.unsubscribe();
      this.timeLeftSub.unsubscribe();
      localStorage.setItem('jairecharge', 'true');
    //  localStorage.setItem('cantcomeback', 'true');
  }

}
