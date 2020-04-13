import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { User } from '../models/user';
import {Joueur} from '../models/joueur';
import {Partie} from '../models/partie';
import {Equipe} from '../models/equipe';

@Injectable()
export class GlobalService {
  private userSource = new BehaviorSubject<User>(new User());
  user = this.userSource.asObservable();
  private joueurSource = new BehaviorSubject<Joueur>(new Joueur());
  joueur = this.joueurSource.asObservable();
  private partieSource = new BehaviorSubject<Partie>(new Partie());
  partie = this.partieSource.asObservable();

  private equipe1Source = new BehaviorSubject<Equipe>(new Equipe());
  equipe1 = this.equipe1Source.asObservable();
  private equipe2Source = new BehaviorSubject<Equipe>(new Equipe());
  equipe2 = this.equipe2Source.asObservable();

  private joueursTeam1Source: BehaviorSubject<Joueur[]> = new BehaviorSubject([]);
  joueursTeam1 = this.joueursTeam1Source.asObservable();
  private joueursTeam2Source: BehaviorSubject<Joueur[]> = new BehaviorSubject([]);
  joueursTeam2 = this.joueursTeam2Source.asObservable();

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
  constructor() {}
}
