import { Component, OnInit } from '@angular/core';
import { AuthenticationService, AlfrescoApiService } from '@alfresco/adf-core';
import { UserRepresentation } from '@alfresco/js-api';
import { Router } from '@angular/router';
import { AuthorizationService } from 'app/services/authorization.service';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  userDetails: any;
  userPermission: string[];
  token: string = "";
  
  constructor(private authService: AuthenticationService, private apiService: AlfrescoApiService, private router: Router, private authorizationService: AuthorizationService,
    private dataService: DataService) { }

  ngOnInit() {
    this.isUserLoggedIn = false;
    this.dataService.token$.subscribe((data) => {
      this.token = data;
      console.log("Ticket", this.token);
    });
    this.getUserAccess();
  }

  getUserAccess() {
    this.authService.getBpmLoggedUser().subscribe((user: UserRepresentation) => {
      this.authorizationService.getPermissions(this.token, user.id + " ").subscribe(res => {
          this.userDetails = res;
          this.userPermission = res.permission;
          console.log("User Details", this.userDetails);
        });
    });
    this.isUserLoggedIn = this.authService.isLoggedIn();
    console.log("User Logged in Status", this.isUserLoggedIn);
  }

  logout() {
    this.isUserLoggedIn = false;
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

}
