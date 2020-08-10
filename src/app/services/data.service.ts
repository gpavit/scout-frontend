import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

    //Observable string sources
    private docId = new BehaviorSubject<string>("");
    private subject = new BehaviorSubject<string>("");
    private doi = new BehaviorSubject<string>("");

    //Observable string streams
    docId$ = this.docId.asObservable();
    subject$ = this.subject.asObservable();
    doi$ = this.doi.asObservable();

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

}
