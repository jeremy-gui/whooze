import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../models/user';
import {Joueur} from '../models/joueur';
import {environment} from '../../environments/environment';
import {mergeMap} from 'rxjs/operators';


@Injectable()
export class JoueurService {

  // http options used for making API calls
  private httpOptions: any;

  baseUrl: string = environment.apiUrl;
  joueurCreated: boolean = false;
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  private joueur: Joueur;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

    public createJoueur(joueur: any): Observable<any> {

      return this.http.post(`${this.baseUrl}timesapp/joueur/create`, JSON.stringify({joueur} ), this.httpOptions);
    }

}
