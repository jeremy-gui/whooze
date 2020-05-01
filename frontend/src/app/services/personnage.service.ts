import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Joueur} from '../models/joueur';
import {stringify} from 'querystring';
import {Personnage} from '../models/personnage';


@Injectable()
export class PersonnageService {

  // http options used for making API calls
  private httpOptions: any;

  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  public createPersonnage(personnage: any): Observable<any> {
    return this.http.post(`${this.baseUrl}personnage/`, JSON.stringify(personnage), this.httpOptions);
  }

  public deletePersonnage(personnage: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}personnage/${personnage.id}`,  this.httpOptions);
  }

  public getPersonnageFromListOfJoueur(joueur: any): Observable<any> {
    let myParams = new HttpParams();
    myParams.set('playerowner', JSON.stringify(joueur));

    return this.http.get(`${this.baseUrl}personnage/`, { headers: this.httpOptions.headers, params: myParams });
  }

  public getPersonnageFromJoueur(joueur: Joueur): Observable<any> {
    let myParams = new HttpParams();
    myParams.set('playerowner', joueur.id.toString());

    return this.http.get(`${this.baseUrl}personnage/`, { headers: this.httpOptions.headers, params: myParams });
  }
/*
  public  getPersoFromAllJouer(team): Observable<any> {
    let listePersonnageComplete: Personnage[] = new Array();
    team.forEach(j => {
      this.getPersonnageFromJoueur(j).subscribe(el => {
        let perso: Personnage = new Personnage();
        perso.id = el.id;
        perso.nom = el.nom;
        perso.playerowner = j.id;
        listePersonnageComplete.push(perso);
      });
    });
  }
*/
  public updatePartielPesonnage(personnage: any, param: any): Observable<any> {
    const body = JSON.stringify(param);
    return this.http.patch(`${this.baseUrl}personnage/${personnage.id}`, body, this.httpOptions);
  }
}
