import { Component, ViewEncapsulation } from '@angular/core';
import { TranslationService, AuthenticationService, AppConfigService, AppConfigValues} from '@alfresco/adf-core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  constructor(translationService: TranslationService,
              private authService: AuthenticationService,
              private router: Router,
              private appConfigService: AppConfigService) {
    translationService.use('en');
    console.log("_____", this.appConfigService.get<string>(AppConfigValues.BPMHOST));
  }
/*
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
*/
}
