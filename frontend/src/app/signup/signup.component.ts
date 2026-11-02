import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ReactiveFormsModule, FormsModule, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CustomValidators} from '../utils/custom-validators';
import {environment} from '../../environments/environment';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {GlobalService} from '../services/global.service';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  title: string;
  user: User;

  constructor(private formBuilder: FormBuilder, private global: GlobalService, public _userService: UserService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('cantcomeback') === 'true') {
      if (localStorage.getItem('manchestarted')) {
        console.log("test");
        localStorage.setItem('cantcomeback', 'false');
        this.router.navigate(['manche']);
      }
    }
    this.user = new User();
    this.title = environment.title;
    this.registerForm = this.formBuilder.group({
   /*     username: [null, Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.required])
        ],*/
        email: [null, Validators.compose([
          Validators.email,
          Validators.required])
        ],
        password: [null, Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          Validators.minLength(6)])
        ],
        confirmPassword: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      });
  }
// convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    } else {
      this.user = new User(this.registerForm.value);
      this._userService.createUserThenConnect(this.user).subscribe (
        data => {
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          this._userService.updateData(data.access, data.refresh);
          const user = new User();
          user.id  = this._userService.user.id;
          user.email = this.user.email;
          this.user = user;
          this.global.me = this.user;
          this._userService.connected = true;
          this.router.navigate(['/'], { state: {data: {"registerOk" : true}}});
         },
        error => {
          console.log(error);
          return;
        }
      );
    }
  }

}


