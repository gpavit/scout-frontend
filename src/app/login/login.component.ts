import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService, AlfrescoApiService } from '@alfresco/adf-core';
import { AuthorizationService } from 'app/services/authorization.service';
import { Router } from '@angular/router';
import { UserRepresentation } from '@alfresco/js-api/src/api/activiti-rest-api/model/userRepresentation';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  ticket: string = '';
  errorMsg: string = '';
  isError: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthenticationService,
    private authorizationService: AuthorizationService, private router: Router,
    private apiService: AlfrescoApiService, private dataService: DataService) {

  }

  ngOnInit() {
    this.submitted = false;
    this.isError = false;
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.dataService.token$.subscribe(tokData => {
      console.log("Tok", tokData);
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    console.log("Login Form Values", this.loginForm.value);
    this.isError = false;
    this.submitted = true;
    if (this.loginForm.invalid) {
      return true;
    } else {
      this.authService.login(this.f.username.value, this.f.password.value).subscribe(res => {
        this.ticket = res.ticket;
        this.dataService.getToken(this.ticket);
        console.log(res);
        this.gotoLink();
      }, error => {
        console.log(error);
        this.isError = true;
        this.errorMsg = "You've entered an unknown username or password";
      });

    }
  }

  gotoLink() {
    this.router.navigate(['/search']);
  }

}
