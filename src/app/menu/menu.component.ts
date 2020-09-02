import { Component, OnInit } from '@angular/core';
import { AuthenticationService, AlfrescoApiService, StorageService } from '@alfresco/adf-core';
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
  isUserLoggedIn: boolean;
  userDetails = [];
  userPermission: string[];
  token: string = "";
  userName: string;
  userFName: string;
  userLName: string;
  userGroup: string;
  constructor(private authService: AuthenticationService, private apiService: AlfrescoApiService, private router: Router, private authorizationService: AuthorizationService,
    private dataService: DataService, private storageService: StorageService) { 
    }

  ngOnInit() {
    this.dataService.token$.subscribe((data) => {
      this.token = data;
      console.log("Ticket", this.token);
    });
    this.isUserLoggedIn = JSON.parse(this.storageService.getItem("refreshData"));
    this.userFName = this.storageService.getItem("userFName");
    this.userLName = this.storageService.getItem("userLName");
    this.userGroup = this.storageService.getItem("userGroup");
    this.userName = this.userFName + ' ' + this.userLName;
    console.log("userName", this.userName);
    this.getUserAccess();
  }

  ngOnChanges() {
    this.userFName = this.storageService.getItem("userFName");
    this.userLName = this.storageService.getItem("userLName");
    this.userGroup = this.storageService.getItem("userGroup");
    this.userName = this.userFName + ' ' + this.userLName;
    console.log("userName", this.userName);
    console.log("userGroup", this.userGroup);
  }

  getUserAccess() {
    this.authService.getBpmLoggedUser().subscribe((user: UserRepresentation) => {
      this.authorizationService.getPermissions(this.token, user.id + " ").subscribe(res => {
          this.userDetails = res;
          this.userPermission = res.permission;
          this.storageService.setItem("userFName", res.firstName);
          this.storageService.setItem("userLName", res.lastName);
          this.storageService.setItem("userGroup", res.userGroup);
          console.log("User Details", this.userDetails);
          this.userFName = this.storageService.getItem("userFName");
          this.userLName = this.storageService.getItem("userLName");
          this.userGroup = this.storageService.getItem("userGroup");
          this.userName = this.userFName + ' ' + this.userLName;
        });
    });
  }


  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
    this.storageService.clear();
  }

}
