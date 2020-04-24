import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  returnUrl: string;
  loginForm: FormGroup;
  submitted: Boolean = false;
  loginButtonPressed: Boolean = false;
  error: string;

  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.authenticationService.logout();

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]]      
    });

    if(this.route.snapshot.queryParams['returnUrl']){
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    }
    else{
      this.returnUrl = '';
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if(!this.loginForm.invalid){
      this.loginButtonPressed = true;
      this.authenticationService.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
      .pipe(first())
      .subscribe(authSucceeded => {
        if(authSucceeded){
          this.router.navigate([this.returnUrl]);
        }
      },
      error => {
        this.error = error;
        this.loginButtonPressed = false;
      });
    }
  }
}
