import { Component, OnInit } from '@angular/core';
import {User} from '../models/user';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Joueur} from '../models/joueur';
import {GlobalService} from '../services/global.service';
import {JoueurService} from '../services/joueur.service';
import {Router} from '@angular/router';
import {PartieService} from '../services/partie.service';

@Component({
  selector: 'app-entercode',
  templateUrl: './entercode.component.html',
  styleUrls: ['./entercode.component.css']
})

export class EntercodeComponent implements OnInit {
  account: User = new User();
  userSub: Subscription;
  submitted = false;
  registerForm: FormGroup;
  joueur: Joueur = new Joueur();
  joueurSub: Subscription;
  nextPage: string;

  constructor(private formBuilder: FormBuilder, private global: GlobalService, public _joueurService: JoueurService, public _partieService: PartieService, private router: Router) {
  }


  ngOnInit(): void {
      if (localStorage.getItem('access_token') || localStorage.getItem('account')) {
        this.userSub = this.global.user.subscribe(
          me => this.account = me
        );

        this.joueurSub = this.global.joueur.subscribe(
          megamer => this.joueur = megamer
        );
        if (localStorage.getItem('joueur')) {
          this.global.megamer = JSON.parse(localStorage.getItem('joueur'));
        }

        this.registerForm = this.formBuilder.group({
          gamecode: [null, Validators.compose([
            Validators.required])
          ],
        });
      }
    }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }


  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    } else {
          this._partieService.getPartieFromGameCode(this.f.gamecode.value).subscribe(
            partie => {
             this.router.navigate(['joingame'], { state: {data: {"creator" : false, "partieid" : partie[0].id}}});
            }
          );
    }
  }
}
