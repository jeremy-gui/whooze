import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Joueur} from '../models/joueur';
import {environment} from '../../environments/environment';
import {Partie} from '../models/partie';
import {filter, retry, switchMap} from 'rxjs/operators';
import {JoueurService} from './joueur.service';
import { map } from 'rxjs/operators';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Injectable()
export class PartieService {

  // http options used for making API calls
  private httpOptions: any;

  authUrl: string = environment.authUrl;
  tokUrl: string = environment.tokUrl;
  WSUrl: string = environment.WSUrl;
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
    return of(this.WSUrl).pipe(
      filter(WSUrl => !!WSUrl),
      // https becomes wws, http becomes ws
      map(WSUrl => WSUrl.replace(/^http/, 'ws') + 'ws/timesapp/chat/'+codepartie+'/'+token+'/'),
      switchMap(wsUrl => {
        if (this.connection$) {
          return this.connection$;
        } else {
          this.connection$ = webSocket(wsUrl);
          return this.connection$;
        }
      }),
      retry({delay: this.RETRY_SECONDS})
    );
  }
  closeConnection() {

    if (this.connection$) {
      this.connection$.complete();
      this.connection$ = null;
    }
  }
  send(data: any, ask: any, _token: string) {
    if (this.connection$) {
      const payload = {
        requete: ask,
        message: data,
        token: _token
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
       return this.http.post(`${this.tokUrl}partie/create`, JSON.stringify({partie} ), this.httpOptions);
  }

  public getPartieFromGameCode(code: any): Observable<any> {
    return this.http.get(`${this.tokUrl}partie/fromgamecode/${code}`, this.httpOptions);
  }

  public getPartieFromId(id: any): Observable<any> {
    return this.http.get(`${this.tokUrl}api/parties/${id}`, this.httpOptions);
  }
}
