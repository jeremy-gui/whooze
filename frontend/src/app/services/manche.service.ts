import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { User } from '../models/user';
import {Joueur} from '../models/joueur';
import {Partie} from '../models/partie';
import {Equipe} from '../models/equipe';
import {Personnage} from '../models/personnage';

@Injectable()
export class MancheService {
  private equipeEnCoursSource = new BehaviorSubject<Equipe>(new Equipe());
  public equipeEnCours = this.equipeEnCoursSource.asObservable();

  private aQuiDeJouerSource = new BehaviorSubject<Joueur>(new Joueur());
  public aQuiDeJouer = this.aQuiDeJouerSource.asObservable();

  private mancheEnCoursSource: BehaviorSubject<number> = new BehaviorSubject(1);
  public mancheEnCours = this.mancheEnCoursSource.asObservable();

  private mancheDemarrerSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public mancheDemarrer = this.mancheDemarrerSource.asObservable();

  private listePersoGoodT1Source: BehaviorSubject<Personnage[]> = new BehaviorSubject([]);
  public listePersoGoodT1 = this.listePersoGoodT1Source.asObservable();

  private listePersoGoodT2Source: BehaviorSubject<Personnage[]> = new BehaviorSubject([]);
  public listePersoGoodT2 = this.listePersoGoodT2Source.asObservable();

  private listePersoToGuessSource: BehaviorSubject<Personnage[]> = new BehaviorSubject([]);
  public listePersoToGuess = this.listePersoToGuessSource.asObservable();

  private afficheScoreSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public afficheScore = this.afficheScoreSource.asObservable();

  private indexJoueurEquipe1Source: BehaviorSubject<number> = new BehaviorSubject(0);
  public indexJoueurEquipe1 = this.indexJoueurEquipe1Source.asObservable();

  private indexJoueurEquipe2Source: BehaviorSubject<number> = new BehaviorSubject(0);
  public indexJoueurEquipe2 = this.indexJoueurEquipe2Source.asObservable();

  private joueursTeamCompleteSource: BehaviorSubject<Joueur[]> = new BehaviorSubject([]);
  public joueursTeamComplete = this.joueursTeamCompleteSource.asObservable();
  private joueursTeamSource: BehaviorSubject<Joueur[]> = new BehaviorSubject([]);
  public joueursTeamTemp = this.joueursTeamSource.asObservable();

  private afficheInterRoundSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public afficheInterRound = this.afficheInterRoundSource.asObservable();

  private timerSource: BehaviorSubject<number> = new BehaviorSubject(0);
  public timer = this.timerSource.asObservable();

  set affichageInterRound(affichage: boolean) {
    localStorage.setItem('afficheinterround', JSON.stringify(affichage));
    this.afficheInterRoundSource.next(affichage);
  }

  set joueurs_teamComplete(joueur: Joueur[]) {
    localStorage.setItem('joueurs_teamComplete', JSON.stringify(joueur));
    this.joueursTeamCompleteSource.next(joueur);
  }

  set joueurs_teamTemp(joueur: Joueur[]) {
    localStorage.setItem('joueurs_teamTemp', JSON.stringify(joueur));
    this.joueursTeamSource.next(joueur);
  }

  set timerseconde(time: number) {
    localStorage.setItem('timer', time.toString());
    this.timerSource.next(time);
  }

  set indexjequipe1(index: number) {
    localStorage.setItem('indexjoueurequipe1', index.toString());
    this.indexJoueurEquipe1Source.next(index);
  }

  set indexjequipe2(index: number) {
    localStorage.setItem('indexjoueurequipe2', index.toString());
    this.indexJoueurEquipe2Source.next(index);
  }

  set persoToGuess(personnage: Personnage[]) {
    localStorage.setItem('persotoguess', JSON.stringify(personnage));
    this.listePersoToGuessSource.next(personnage);
  }

  set affichageScore(affichage: boolean) {
    localStorage.setItem('affichescore', JSON.stringify(affichage));
    this.afficheScoreSource.next(affichage);
  }

  set personnageOkT1(personnage: Personnage[]) {
    localStorage.setItem('personnagegoodT1', JSON.stringify(personnage));
    this.listePersoGoodT1Source.next(personnage);
  }
  set personnageOkT2(personnage: Personnage[]) {
    localStorage.setItem('personnagegoodT2', JSON.stringify(personnage));
    this.listePersoGoodT2Source.next(personnage);
  }

  set equipeCourante(equipe: Equipe) {
    console.log('equipecourante:'+equipe.nom);
    localStorage.setItem('equipecourante', JSON.stringify(equipe));
    this.equipeEnCoursSource.next(equipe);
  }

  set quijoue(joueur: Joueur) {
    console.log('aquidejouerservice : '+joueur.username);
    localStorage.setItem('aquidejouer', JSON.stringify(joueur));
    this.aQuiDeJouerSource.next(joueur);
  }

  set mancheactuelle(nummanche: number) {
    localStorage.setItem('mancheencours', nummanche.toString());
    this.mancheEnCoursSource.next(nummanche);
  }

  set manchestart(isstarted: boolean) {
    localStorage.setItem('manchestarted', isstarted.toString());
    this.mancheDemarrerSource.next(isstarted);
  }

  constructor() {}
}
