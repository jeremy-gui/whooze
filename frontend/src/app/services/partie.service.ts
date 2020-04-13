import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Joueur} from '../models/joueur';
import {environment} from '../../environments/environment';
import {Partie} from '../models/partie';
import {mergeMap} from 'rxjs/operators';
import {JoueurService} from './joueur.service';
import { map } from 'rxjs/operators';

@Injectable()
export class PartieService {

  // http options used for making API calls
  private httpOptions: any;

  baseUrl: string = environment.apiUrl;
  public partie: Partie;
  public  partieCreated = false;

  constructor(private http: HttpClient, public joueurService: JoueurService) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
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

}
