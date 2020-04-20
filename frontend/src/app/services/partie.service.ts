import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Joueur} from '../models/joueur';
import {environment} from '../../environments/environment';
import {Partie} from '../models/partie';
import {delay, filter, mergeMap, retryWhen, switchMap} from 'rxjs/operators';
import {JoueurService} from './joueur.service';
import { map } from 'rxjs/operators';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Injectable()
export class PartieService {

  // http options used for making API calls
  private httpOptions: any;

  baseUrl: string = environment.apiUrl;
  public partie: Partie;
  public  partieCreated = false;
  connection$: WebSocketSubject<any>;
  RETRY_SECONDS = 10;

  constructor(private http: HttpClient, public joueurService: JoueurService) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }


  connect(codepartie: any, token: any): Observable<any> {
    return of(this.baseUrl).pipe(
      filter(apiUrl => !!apiUrl),
      // https becomes wws, http becomes ws
      map(apiUrl => apiUrl.replace(/^http/, 'ws') + 'ws/timesapp/chat/'+codepartie+'/'+token+'/'),
      switchMap(wsUrl => {
        if (this.connection$) {
          return this.connection$;
        } else {
          this.connection$ = webSocket(wsUrl);
          return this.connection$;
        }
      }),
      retryWhen((errors) => errors.pipe(delay(this.RETRY_SECONDS)))
    );
  }
  closeConnection() {
    if (this.connection$) {
      this.connection$.complete();
      this.connection$ = null;
    }
  }
  send(data: any, ask: any) {
    if (this.connection$) {
      const payload = {
        requete: ask,
        message: data,
      };
      this.connection$.next(payload);
    }
  }
  public  createPartieThenUpdateJoueur(partie: any, joueur: Joueur): Observable<any> {
    const results = [];

    return this.createPartie(partie).pipe(
      map((partiecree) => {
        joueur.partiencours = partiecree.id;
        this.partie = partiecree;
        results.push(partiecree);
        this.joueurService.updatePartielJoueur(joueur, {partiencours: joueur.partiencours});
        return results;
      })
    );
  }


  public createPartie(partie: any): Observable<any> {
       return this.http.post(`${this.baseUrl}timesapp/partie/create`, JSON.stringify({partie} ), this.httpOptions);
  }

  public getPartieFromGameCode(code: any): Observable<any> {
    return this.http.get(`${this.baseUrl}timesapp/partie/fromgamecode/${code}`, this.httpOptions);
  }

  public getPartieFromId(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}timesapp/api/parties/${id}`, this.httpOptions);
  }
}
