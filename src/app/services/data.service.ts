import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

    //Observable string sources
    private docId = new BehaviorSubject<string>("");
    private subject = new BehaviorSubject<string>("");
    private doi = new BehaviorSubject<string>("");
    private token = new BehaviorSubject<string>("");
//    private isLoggedIn = new BehaviorSubject<boolean>(false);
    private firstName = new BehaviorSubject<string>("");
    private lastName = new BehaviorSubject<string>("");
    private userGroup = new BehaviorSubject<string>("");

    //Observable string streams
    docId$ = this.docId.asObservable();
    subject$ = this.subject.asObservable();
    doi$ = this.doi.asObservable();
    token$ = this.token.asObservable();
//    isLoggedIn$ = this.isLoggedIn.asObservable();
    firstName$ = this.firstName.asObservable();
    lastName$ = this.lastName.asObservable();
    userGroup$ = this.userGroup.asObservable();

    //Service message commands
    getDocId(docData: string) {
        this.docId.next(docData);
    }

    getSubject(subData: string) {
        this.subject.next(subData);
    }

    getDoi(doiData: string) {
        this.doi.next(doiData);
    }

    getToken(tokData: string) {
        this.token.next(tokData);
    }

//    getLoggedIn(loggedInData: boolean) {
//        this.isLoggedIn.next(loggedInData);
//    }

    getFirstName(firstNameData: string) {
        this.firstName.next(firstNameData);
    }

    getLastName(lastNameData: string) {
        this.lastName.next(lastNameData);
    }

    getUserGroup(userGroupData: string) {
        this.userGroup.next(userGroupData);
    }
}
