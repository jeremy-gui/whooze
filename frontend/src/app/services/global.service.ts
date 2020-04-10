import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import {Joueur} from '../models/joueur';
import {Partie} from '../models/partie';

@Injectable()
export class GlobalService {
  private userSource = new BehaviorSubject<User>(new User());
  user = this.userSource.asObservable();
  private joueurSource = new BehaviorSubject<Joueur>(new Joueur());
  joueur = this.joueurSource.asObservable();
  private partieSource = new BehaviorSubject<Partie>(new Partie());
  partie = this.partieSource.asObservable();

  set me(user: User) {
    localStorage.setItem('account', JSON.stringify(user));
    this.userSource.next(user);
  }

  set megamer(joueur: Joueur) {
    localStorage.setItem('joueur', JSON.stringify(joueur));
    this.joueurSource.next(joueur);
  }

  set megame(partie: Partie) {
    localStorage.setItem('partie', JSON.stringify(partie));
    this.partieSource.next(partie);
  }

  constructor() {}
}
