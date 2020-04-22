import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Joueur} from '../models/joueur';
import {environment} from '../../environments/environment';


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
    return this.http.post(`${this.baseUrl}timesapp/personnage/`, JSON.stringify(personnage), this.httpOptions);
  }

  public deletePersonnage(personnage: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}timesapp/personnage/${personnage.id}`,  this.httpOptions);
  }

  public updatePartielPesonnage(personnage: any, param: any): Observable<any> {
    const body = JSON.stringify(param);
    return this.http.patch(`${this.baseUrl}timesapp/personnage/${personnage.id}`, body, this.httpOptions);
  }
}
