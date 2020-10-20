import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

    //Observable string sources
    private docId = new BehaviorSubject<string>("");
    private subject = new BehaviorSubject<string>("");
    private doi = new BehaviorSubject<string>("");
    private ediNbrBK = new BehaviorSubject<string>("");
    private ediRevNbr = new BehaviorSubject<string>("");
    private ediRevStat = new BehaviorSubject<string>("");
    private isbnEdiRevNbr = new BehaviorSubject<string>("");
    private warnMsg = new BehaviorSubject<string>("");
    private isbnOnline = new BehaviorSubject<string>("");
    private isbnPaperback = new BehaviorSubject<string>("");
    private isbnHardback = new BehaviorSubject<string>("");
    private isbnEbookEPub = new BehaviorSubject<string>("");
    private isbnEbookUPdf = new BehaviorSubject<string>("");
    private isbnOtherPrint = new BehaviorSubject<string>("");
    private changeField = new BehaviorSubject<string>("");
    private extent = new BehaviorSubject<string>("");

    private token = new BehaviorSubject<string>("");
//    private isLoggedIn = new BehaviorSubject<boolean>(false);
    private firstName = new BehaviorSubject<string>("");
    private lastName = new BehaviorSubject<string>("");
    private userGroup = new BehaviorSubject<string>("");

    //Observable string streams
    docId$ = this.docId.asObservable();
    subject$ = this.subject.asObservable();
    doi$ = this.doi.asObservable();
    ediNbrBK$ = this.ediNbrBK.asObservable();
    ediRevNbr$ = this.ediRevNbr.asObservable();
    ediRevStat$ = this.ediRevStat.asObservable();
    isbnEdiRevNbr$ = this.isbnEdiRevNbr.asObservable();
    warnMsg$ = this.warnMsg.asObservable();
    isbnOnline$ = this.isbnOnline.asObservable();
    isbnPaperback$ = this.isbnPaperback.asObservable();
    isbnHardback$ = this.isbnHardback.asObservable();
    isbnEbookEPub$ = this.isbnEbookEPub.asObservable();
    isbnEbookUPdf$ = this.isbnEbookUPdf.asObservable();
    isbnOtherPrint$ = this.isbnOtherPrint.asObservable();
    changeField$ = this.changeField.asObservable();
    extent$ = this.extent.asObservable();

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

    getEdiNbrBK(ediNbrBKData: string) {
        this.ediNbrBK.next(ediNbrBKData);
    }
    
    getEdiRevNbr(ediRevNbrData: string) {
        this.ediRevNbr.next(ediRevNbrData);
    }

    getEdiRevStat(ediRevStatData: string) {
        this.ediRevStat.next(ediRevStatData);
    }

    getIsbnEdiRevNbr(isbnEdiRevNbrData: string) {
        this.isbnEdiRevNbr.next(isbnEdiRevNbrData);
    }

    getWarnMsg(warnMsgData: string) {
        this.warnMsg.next(warnMsgData);
    }

    getIsbnOnline(onlineData: string) {
        this.isbnOnline.next(onlineData);
    }
    
    getIsbnPaperback(paperbackData: string) {
        this.isbnPaperback.next(paperbackData);
    }

    getIsbnHardback(hardbackData: string) {
        this.isbnHardback.next(hardbackData);
    }

    getIsbnEbookEPub(epubData: string) {
        this.isbnEbookEPub.next(epubData);
    }

    getIsbnEbookUPdf(updfData: string) {
        this.isbnEbookUPdf.next(updfData);
    }

    getOtherPrint(otherData: string) {
        this.isbnOtherPrint.next(otherData);
    }

    getChangeField(changeData: string) {
        this.changeField.next(changeData);
    }

    getExtent(extentData: string) {
        this.extent.next(extentData);
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
