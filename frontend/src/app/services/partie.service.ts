import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Joueur} from '../models/joueur';
import {environment} from '../../environments/environment';
import {Partie} from '../models/partie';


@Injectable()
export class PartieService {

  // http options used for making API calls
  private httpOptions: any;

  baseUrl: string = environment.apiUrl;
  private partie: Partie;
  public  partieCreated: boolean = false;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  public createPartie(partie: any): Observable<any> {
    return this.http.post(`${this.baseUrl}timesapp/partie/create`, JSON.stringify({partie} ), this.httpOptions);
  }

}
