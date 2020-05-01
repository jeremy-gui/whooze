import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Equipe} from '../models/equipe';
import {environment} from '../../environments/environment';
import {Partie} from '../models/partie';


@Injectable()
export class EquipeService {

  // http options used for making API calls
  private httpOptions: any;

  baseUrl: string = environment.apiUrl;
  equipeCreated = false;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  public createEquipe(equipe: any): Observable<any> {
    this.equipeCreated = true;
    return this.http.post(`${this.baseUrl}equipe/create`, JSON.stringify({equipe} ), this.httpOptions);
  }


  public updatePartielEquipe(equipe: any, param: any): Observable<any> {
    let body = JSON.stringify(param);
    return this.http.patch(`${this.baseUrl}equipe/update/${equipe.id}`, body, this.httpOptions);
  }

  public  getEquipe(partie: Partie) {
    return this.http.get(`${this.baseUrl}equipe/frompartie/${partie.id}`, this.httpOptions);
  }
}
