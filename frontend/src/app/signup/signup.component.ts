import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CustomValidators} from '../utils/custom-validators';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  title: string;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
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

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
  }

}


