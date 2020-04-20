import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule, FormsModule, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GlobalService} from '../services/global.service';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {JoueurService} from '../services/joueur.service';
import {Joueur} from '../models/joueur';
import {User} from '../models/user';
import {Subscription} from 'rxjs';
import {Partie} from '../models/partie';

@Component({
  selector: 'app-chooseusername',
  templateUrl: './chooseusername.component.html',
  styleUrls: ['./chooseusername.component.css']
})
export class ChooseusernameComponent implements OnInit {
  account: User = new User();
  userSub: Subscription;
  submitted = false;
  registerForm: FormGroup;
  joueur: Joueur;
  nextPage: string;

  constructor(private formBuilder: FormBuilder, private global: GlobalService, public _joueurService: JoueurService, private router: Router) { }

  ngOnInit(): void {

    if (history.state.data && history.state.data.creategame) {
      this.nextPage = "creategame";
    }
    if (history.state.data && history.state.data.joingame) {
      this.nextPage = "joingame";
    }
    if (localStorage.getItem('token') || localStorage.getItem('account')) {

      this.account = JSON.parse(localStorage.getItem('account'));
      this.userSub = this.global.user.subscribe(
        me => this.account = me
      );

      if (localStorage.getItem('partie') && localStorage.getItem('joueur')) {
        const oldPartie: Partie = JSON.parse(localStorage.getItem('partie'));
        if (oldPartie.owner_id === this.account.id) {
          this.router.navigate(['creategame']);
        }
        else {
          this.router.navigate(['joingame']);
        }
      }
      this.registerForm = this.formBuilder.group({
             username: [null, Validators.compose([
               Validators.minLength(3),
               Validators.maxLength(20),
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
      this.joueur = this.registerForm.value;
      this.joueur.owner_id = this.account.id;
      this._joueurService.createJoueur(this.joueur).subscribe(
        data => {
          this.joueur = data;
          localStorage.setItem('joueur', JSON.stringify(this.joueur));

          this._joueurService.joueurCreated = true;
          if (this.nextPage === "creategame") {
          this.router.navigate(['creategame'], { state: {data: {"creator" : true}}});
          } else if (this.nextPage === "joingame") {
           this.router.navigate(['entergamecode'], { state: {data: {"creator" : false}}});
          }
        },
        error => {
          console.log(error);
          this._joueurService.joueurCreated = false;
          return;
        }
      );
    }
  }
}
