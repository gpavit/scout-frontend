import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContentModule } from '@alfresco/adf-content-services';
import { ProcessModule } from '@alfresco/adf-process-services';
import { CoreModule, TranslateLoaderService, AppConfigService, AppConfigServiceMock, AuthenticationService } from '@alfresco/adf-core';
import { LoginComponent } from './login.component';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AuthorizationService } from 'app/services/authorization.service';
import { DataService } from 'app/services/data.service';
import { BehaviorSubject, of } from 'rxjs';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { inject } from '@angular/core/src/di/injector';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let token;
  let token$;
  const loginServiceSpy = jasmine.createSpyObj('LoginService', ['login']);
  const AuthorizationServiceMock = [];
  const DataServiceMock = {
//    private token = new BehaviorSubject<string>(""),
//    public token$ = this.token.asObservable()
  };
  const validUser = {
    username: 'viewer@oup.com',
    password: 'Demo@123'
  };
  const blankUser = {
    username: '',
    password: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        CoreModule.forRoot(),
        ContentModule.forRoot(),
        ProcessModule.forRoot(),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderService }
        }),
        ReactiveFormsModule, 
        FormsModule
      ],
      declarations: [LoginComponent],
      providers: [
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        { provide: AppConfigService, useClass: AppConfigServiceMock },
        { provide: AuthorizationService, useValue: AuthorizationServiceMock },
        { provide: DataService, useValue: DataServiceMock }
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  function updateForm(userName, userPassword) {
    component.loginForm.controls['username'].setValue(userName);
    component.loginForm.controls['password'].setValue(userPassword);
  }

  it('form invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
});

});
