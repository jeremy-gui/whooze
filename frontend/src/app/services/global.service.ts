import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { User } from '../models/user';
import {Joueur} from '../models/joueur';
import {Partie} from '../models/partie';
import {Equipe} from '../models/equipe';
import {Personnage} from '../models/personnage';

@Injectable()
export class GlobalService {
  private userSource = new BehaviorSubject<User>(new User());
  public user = this.userSource.asObservable();
  private joueurSource = new BehaviorSubject<Joueur>(new Joueur());
  public joueur = this.joueurSource.asObservable();
  private partieSource = new BehaviorSubject<Partie>(new Partie());
  public partie = this.partieSource.asObservable();

  private equipe1Source = new BehaviorSubject<Equipe>(new Equipe());
  public equipe1 = this.equipe1Source.asObservable();
  private equipe2Source = new BehaviorSubject<Equipe>(new Equipe());
  public equipe2 = this.equipe2Source.asObservable();

  private joueursTeam1Source: BehaviorSubject<Joueur[]> = new BehaviorSubject([]);
  public joueursTeam1 = this.joueursTeam1Source.asObservable();
  private joueursTeam2Source: BehaviorSubject<Joueur[]> = new BehaviorSubject([]);
  public joueursTeam2 = this.joueursTeam2Source.asObservable();

  private personnageSource: BehaviorSubject<Personnage[]> = new BehaviorSubject([]);
  public personnages = this.personnageSource.asObservable();

  private personnagesCompleteSource: BehaviorSubject<Personnage[]> = new BehaviorSubject([]);
  public personnagesComplete = this.personnagesCompleteSource.asObservable();

  set me(user: User) {
    localStorage.setItem('account', JSON.stringify(user));
    this.userSource.next(user);
  }


  set joueurs_team1(joueur: Joueur[]) {
    localStorage.setItem('joueurs_team1', JSON.stringify(joueur));
    this.joueursTeam1Source.next(joueur);
  }

  set joueurs_team2(joueur: Joueur[]) {
    localStorage.setItem('joueurs_team2', JSON.stringify(joueur));
    this.joueursTeam2Source.next(joueur);
  }

  set megamer(joueur: Joueur) {
    localStorage.setItem('joueur', JSON.stringify(joueur));
    this.joueurSource.next(joueur);
  }

  set megame(partie: Partie) {
    localStorage.setItem('partie', JSON.stringify(partie));
    this.partieSource.next(partie);
  }

  set meteam1(equipe: Equipe) {
    localStorage.setItem('equipe1', JSON.stringify(equipe));
    this.equipe1Source.next(equipe);
  }

  set meteam2(equipe: Equipe) {
    localStorage.setItem('equipe2', JSON.stringify(equipe));
    this.equipe2Source.next(equipe);
  }

  set mepersonnages(perso: Personnage[]) {
    localStorage.setItem('personnages', JSON.stringify(perso));
    this.personnageSource.next(perso);
  }

  set melistepersonnagescomplete(perso: Personnage[]) {
    localStorage.setItem('liste_personnages', JSON.stringify(perso));
    this.personnagesCompleteSource.next(perso);
  }

  constructor() {}
}
