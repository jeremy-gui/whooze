import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../custom-validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }

  public registerForm: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: [null, Validators.compose([
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.required])
    ],
      email: [null, Validators.compose([
        Validators.email,
        Validators.required])
      ],
      password: [null, Validators.compose([
        Validators.required,
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        Validators.minLength(8)])
  ],
    confirmPassword: [null, Validators.compose([Validators.required])]
  },
    {
      // check whether our password and confirm password match
      validator: CustomValidators.passwordMatchValidator
    });

  }

  submit() {
    if (this.registerForm.valid) {
      alert('User form is valid!!');
    } else {
      alert('User form is not valid!!');
    }
  }
}


