import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Joueur} from '../models/joueur';
import {environment} from '../../environments/environment';


@Injectable()
export class JoueurService {

  // http options used for making API calls
  private httpOptions: any;

  baseUrl: string = environment.apiUrl;
  joueurCreated = false;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

    public createJoueur(joueur: any): Observable<any> {
       return this.http.post(`${this.baseUrl}joueur/create`, JSON.stringify({joueur} ), this.httpOptions);
    }


  public updatePartielJoueur(joueur: any, param: any): Observable<any> {
    const body = JSON.stringify(param);
    return this.http.patch(`${this.baseUrl}joueur/update/${joueur.id}`, body, this.httpOptions);
  }
}
