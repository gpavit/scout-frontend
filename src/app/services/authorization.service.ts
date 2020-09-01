import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.service';


@Injectable()
export class AuthorizationService {
    permissionUrl = "http://10.228.154.155:8083/activiti-app/api/enterprise/permission/";
    countryUrl = "http://10.228.154.155:8083/activiti-app/api/enterprise/countries";
    token: any = "";
    
    constructor(private http: HttpClient, private dataService: DataService) {
    }

    getCountryList(token): Observable <any>{
        const header = new HttpHeaders().set( 'Authorization', `${token}` );
        const options = { headers: header }
        return this.http.get<any>(this.countryUrl, options); 
    }  

    getPermissions(token, id): Observable <any>{
        const header = new HttpHeaders().set( 'Authorization', `${token}` );
        const options = { headers: header }
        return this.http.get<any>(this.permissionUrl + id, options); 
    }
    
}
