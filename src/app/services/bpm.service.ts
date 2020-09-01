import { Injectable } from '@angular/core';
import { AuthenticationService } from '@alfresco/adf-core';




@Injectable()
export class BPMService {
    userStatus: boolean = false;

    constructor(private authService: AuthenticationService) {
    }

    getBPMLoggedUser() {
        this.userStatus = this.authService.isLoggedIn();
        localStorage.setItem("refreshData", JSON.stringify(this.userStatus));
    }
}