import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { RegistrationService } from '../_services/registration.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  submitted: Boolean = false;
  registerButtonPressed: Boolean = false;
  error: string;

  constructor(private router: Router, private registrationService: RegistrationService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]], 
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.checkPasswords });
  }

  onSubmit(): void {
    this.submitted = true;
    if(!this.registrationForm.invalid){
      this.registerButtonPressed = true;
      this.registrationService.register(this.registrationForm.controls.username.value, this.registrationForm.controls.email.value, this.registrationForm.controls.password.value)
      .pipe(first())
      .subscribe(registrationSucceeded => {
        if(registrationSucceeded){
          this.router.navigate(["/login"]);
        }
      },
      error => {
        this.error = error;
        this.registerButtonPressed = false;
      });
    }
  }

  login(): void {
    this.router.navigate(["/login"]);
  }

  private checkPasswords(formGroup: FormGroup){
    return formGroup.get('password').value === formGroup.get('confirmPassword').value ?
      null : 
      { passwordMismatch: true };
  }
}
