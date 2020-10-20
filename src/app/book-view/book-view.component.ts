import { Component, OnInit, HostListener, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forbiddenNameValidator } from 'app/directives/forbidden-name.directive';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppsProcessService, StorageService, AuthenticationService } from '@alfresco/adf-core';
import { ProcessService, ProcessInstance } from '@alfresco/adf-process-services';
import { DataService } from 'app/services/data.service';
import { AuthorizationService } from 'app/services/authorization.service';
import { AppDefinitionRepresentation, ProcessDefinitionRepresentation } from '@alfresco/js-api';
import * as moment from 'moment';

@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.component.html',
  styleUrls: ['./book-view.component.scss']
})
export class BookViewComponent implements OnInit {
  bookViewForm: FormGroup;
  submitted: boolean = false;
  copyStat: string = '';
  countryCode: string;
  country: string;
  year: number;
  filteredOptions: Observable<string[]>;
  appName = 'POC-CMM';
  errorMessage: string = "";
  successMessage: string = "";
  saveRecordProcessKey = 'SaveRecord';
  saveProcessDefinationId = "";
  subject: string = "";
  doi: string = "";
  docId: string = "";
  ediNbrBK: any = "";
  ediRevNbr: string = "";
  ediRevStat: string = "";
  isbnEdiRevNbr: string = "";
  warningMessage: any;
  warning_message: any;
  wErrMsg = [];
  message: any = "";
  countryData = [];
  code: any = "";
  token: string = "";
  ediNbrBkErrMSg: string = "";
  doiErrMsg: string = "";
  ediRevNbrErrMsg: string = "";
  ediRevStatErrMsg: string = "";
  subjectErrMsg: string = "";
  isbnPaperbackErrMsg: string = "";
  isbnOtherPrintErrMsg: string = "";
  isbnHardbackErrMsg: string = "";
  isbnEbookUpdfErrMsg: string = "";
  isbnEbookEpubErrMsg: string = "";
  isbnOnlineErrMsg: string = "";
  isbn_display1 = [];
  isbn_display2 = [];
  isbn_display3 = [];
  isbn_online: string = "";
  isbn_paperback: string = "";
  isbn_hardback: string = "";
  isbn_ebook_updf: string = "";
  isbn_ebook_epub: string = "";
  isbn_other_print: string = "";
  isbn_array = [];
  isbn_online_array = [];
  isbn_epub_array = [];
  isbn_updf_array = [];
  isbn_hb_array = [];
  isbn_pb_array = [];
  isbn_other_array = [];
  changedField: string = "";
  change_field = [];
  changeCollection: string = "";
  changeExtent: string = "";
  changedoi: string = "";
  changeeditionRevisionNo: string = "";
  changeeditionRevisionStatement: string = "";
  changeisbnFirstEdition: string = "";
  highlightedText: string = "Field value updated";
  extent: string = "";
  extentBKErrMsg: string = "";
  arrayItems: {
    online: string;
    printhb: string;
  }[];
  userName: string;
  userFName: string;
  userLName: string;
  userGroup: string;
  copyright_icon() {
    return `<i class="fa fa-copyright" aria-hidden="true"></i>`;
  }


  constructor(private fb: FormBuilder, private appProcessService: AppsProcessService,
    private processService: ProcessService, private dataService: DataService,
    private authorizationService: AuthorizationService, @Inject(DOCUMENT) document, private storageService: StorageService, 
    private authService: AuthenticationService, private router: Router) {
    this.bookViewForm = this.fb.group({
      country: ['', Validators.required],
      countryCode: [''],
      collectionModuleBK: [''],
      doi: ['', Validators.required],
      copyRightHolder: ['', [Validators.required, forbiddenNameValidator(/licence|license|creative commons/i)]],
      copyRightYear: ['', [Validators.required, Validators.pattern('[0-9]{4}'), Validators.min(1700), Validators.max(2020)]],
      copyRightStatement: [this.copyStat],
      editionNumberBK: [''],
      editionRevisionNo: [''],
      editionRevisionStatement: [''],
      isbnFirstEdition: ['', [Validators.required]],
      bookArray: this.fb.array([]),
      isbnElectronic: [''],
      isbnEbookePub: [''],
      isbnEbookuPdf: [''],
      isbnPrinthb: [''],
      isbnPrintOther: [''],
      isbnPrintpb: [''],
      extentBK: ['']
    });
    this.isbn_display1 = ["Online", "Paperback", "Hardback"];
    this.isbn_display2 = ["eBook uPDF", "Other Print"];
    this.isbn_display3 = ["eBook ePUB"];
  }

  ngOnInit() {
    this.arrayItems = [];
    this.dataService.docId$.subscribe((data) => {
      this.docId = data
      console.log("DocId", this.docId);
    });
    this.dataService.subject$.subscribe((data) => {
      this.subject = data
      console.log("Subject", this.subject);
    });
    this.dataService.doi$.subscribe((data) => {
      this.doi = data
      console.log("Doi", this.doi);
    });
    this.dataService.ediNbrBK$.subscribe((data) => {
      this.ediNbrBK = data
      console.log("Edition Number BK", this.ediNbrBK);
    });
    this.dataService.ediRevNbr$.subscribe((data) => {
      this.ediRevNbr = data
      console.log("Edition Revision Number", this.ediRevNbr);
    });
    this.dataService.ediRevStat$.subscribe((data) => {
      this.ediRevStat = data
      console.log("Edition Revision Statement", this.ediRevStat);
    });
    this.dataService.isbnEdiRevNbr$.subscribe((data) => {
      this.isbnEdiRevNbr = data
      console.log("Isbn Edition Revision Number", this.isbnEdiRevNbr);
    });
    this.dataService.warnMsg$.subscribe((data) => {
      this.warningMessage = data
      console.log("Warning Message", this.warningMessage);
    });
    this.dataService.isbnOnline$.subscribe(data => {
      this.isbn_online = data;
      console.log("isbn online", this.isbn_online);
    });
    this.dataService.isbnPaperback$.subscribe(data => {
      this.isbn_paperback = data;
      console.log("isbn paperback", this.isbn_paperback);
    });
    this.dataService.isbnHardback$.subscribe(data => {
      this.isbn_hardback = data;
      console.log("isbn hardback", this.isbn_hardback);
    });
    this.dataService.isbnEbookEPub$.subscribe(data => {
      this.isbn_ebook_epub = data;
      console.log("isbn ebookepub", this.isbn_ebook_epub);
    });
    this.dataService.isbnEbookUPdf$.subscribe(data => {
      this.isbn_ebook_updf = data;
      console.log("isbn ebookupdf", this.isbn_ebook_updf);
    });
    this.dataService.isbnOtherPrint$.subscribe(data => {
      this.isbn_other_print = data;
      console.log("isbn other print", this.isbn_other_print);
    });
    this.dataService.changeField$.subscribe(data => {
      this.changedField = data;
      console.log("Changed Fields", this.changedField);
    });
    this.dataService.extent$.subscribe(data => {
      this.extent = data;
      console.log("Extent BK", this.extent);
    });
    this.dataService.token$.subscribe((data) => {
      this.token = data;
      console.log("Ticket", this.token);
    });
    setTimeout(() => {
      this.getAppName();
    }, 100);
    this.getCountry();
    this.userFName = this.storageService.getItem("userFName");
    this.userLName = this.storageService.getItem("userLName");
    this.userGroup = this.storageService.getItem("userGroup");
    this.userName = this.userFName + ' ' + this.userLName;
    this.bookViewForm.controls['collectionModuleBK'].setValue(this.subject);
    this.bookViewForm.controls['doi'].setValue(this.doi);
    this.ediNbrBK = Math.trunc(this.ediNbrBK);
    this.bookViewForm.controls['editionRevisionNo'].setValue(this.ediRevNbr);
    this.bookViewForm.controls['editionRevisionStatement'].setValue(this.ediRevStat);
    this.bookViewForm.controls['isbnFirstEdition'].setValue(this.isbnEdiRevNbr);
    this.isbn_online = JSON.parse(this.isbn_online);
    this.bookViewForm.controls['isbnElectronic'].setValue(this.isbn_online);
    this.isbn_ebook_epub = JSON.parse(this.isbn_ebook_epub);
    this.bookViewForm.controls['isbnEbookePub'].setValue(this.isbn_ebook_epub);
    this.isbn_ebook_updf = JSON.parse(this.isbn_ebook_updf);
    this.bookViewForm.controls['isbnEbookuPdf'].setValue(this.isbn_ebook_updf);
    this.isbn_hardback = JSON.parse(this.isbn_hardback);
    this.bookViewForm.controls['isbnPrinthb'].setValue(this.isbn_hardback);
    this.isbn_other_print = JSON.parse(this.isbn_other_print);
    this.bookViewForm.controls['isbnPrintOther'].setValue(this.isbn_other_print);
    this.isbn_paperback = JSON.parse(this.isbn_paperback);
    this.bookViewForm.controls['isbnPrintpb'].setValue(this.isbn_paperback);
    this.bookViewForm.controls['extentBK'].setValue(this.extent);

    if (this.isbn_online) {
      for (let i = 0; i < this.isbn_online.length; i++) {
        this.isbn_online_array.push(this.isbn_online[i]);
      }
    }
    if (this.isbn_ebook_epub) {
      for (let i = 0; i < this.isbn_ebook_epub.length; i++) {
        this.isbn_epub_array.push(this.isbn_ebook_epub[i]);
      }
    }
    if (this.isbn_ebook_updf) {
      for (let i = 0; i < this.isbn_ebook_updf.length; i++) {
        this.isbn_updf_array.push(this.isbn_ebook_updf[i]);
      }
    }
    if (this.isbn_hardback) {
      for (let i = 0; i < this.isbn_hardback.length; i++) {
        this.isbn_hb_array.push(this.isbn_hardback[i]);
      }
    }
    if (this.isbn_other_print) {
      for (let i = 0; i < this.isbn_other_print.length; i++) {
        this.isbn_other_array.push(this.isbn_other_print[i]);
      }
    }
    if (this.isbn_paperback) {
      for (let i = 0; i < this.isbn_paperback.length; i++) {
        this.isbn_pb_array.push(this.isbn_paperback[i]);
      }
    }
    console.log("Isbn onix recrds", this.isbn_array);
    var temp = [];
    if (this.changedField) {
      for(let i = 0; i < this.changedField.length; i++) {
        temp.push(this.changedField[i])
      }
      console.log("#### temp", temp);
      for(let i = 0; i < temp.length; i++) {
        if (temp[i].fieldName == 'collectionModuleBK') {
          this.changeCollection = this.highlightedText;
        }
        if (temp[i].fieldName == 'extentBK') {
          this.changeExtent = this.highlightedText;
        }
        if (temp[i].fieldName == 'doi') {
          this.changedoi = this.highlightedText;
        }
        if (temp[i].fieldName == 'editionRevisionNo') {
          this.changeeditionRevisionNo = this.highlightedText;
        }
        if (temp[i].fieldName == 'editionRevisionStatement') {
          this.changeeditionRevisionStatement = this.highlightedText;
        }
        if (temp[i].fieldName == 'isbnFirstEdition') {
          this.changeisbnFirstEdition = this.highlightedText;
        }        
      }
    }
    if (this.warningMessage) {
      this.warning_message = JSON.parse(this.warningMessage);
      console.log("Warning Message", this.warning_message);
      for (let i = 0; i < this.warning_message.length; i++) {
        //        this.wErrMsg.push(this.warning_message[i])
        if (this.f.collectionModuleBK.value == null) {
          if (this.warning_message[i].fieldName == 'collectionModuleBK') {
            this.subjectErrMsg = this.warning_message[i].value;
          } else {
            this.bookViewForm.controls['collectionModuleBK'].setValue(this.subject);
          }
        }
        if (this.f.doi.value == null) {
          if (this.warning_message[i].fieldName == "doi") {
            this.doiErrMsg = this.warning_message[i].value;
          } else {
            this.bookViewForm.controls['doi'].setValue(this.doi);
          }
        }
        if (this.f.editionNumberBK.value == "") {
          if (this.warning_message[i].fieldName == 'editionNumberBK') {
            this.ediNbrBkErrMSg = this.warning_message[i].value;
          } else {
            this.bookViewForm.controls['editionNumberBK'].setValue(this.ediNbrBK);
          }
        }
        if (this.f.editionRevisionNo.value == null) {
          if (this.warning_message[i].fieldName == 'editionRevisionNo') {
            this.ediRevNbrErrMsg = this.warning_message[i].value;
          } else {
            this.bookViewForm.controls['editionRevisionNo'].setValue(this.ediRevNbr);
          }
        }
        if (this.f.isbnElectronic.value == null) {
          if (this.warning_message[i].fieldName == 'isbnElectronic') {
            this.isbnOnlineErrMsg = this.warning_message[i].value;
          } else {
            this.bookViewForm.controls['isbnElectronic'].setValue(this.isbn_online);
          }
        }
        if (this.f.isbnEbookePub.value == null) {
          if (this.warning_message[i].fieldName == 'isbnEbookePub') {
            this.isbnEbookEpubErrMsg = this.warning_message[i].value;
          } else {
            this.bookViewForm.controls['isbnEbookePub'].setValue(this.isbn_ebook_epub);
          }
        }
        if (this.f.isbnEbookuPdf.value == null) {
          if (this.warning_message[i].fieldName == 'isbnEbookuPdf') {
            this.isbnEbookUpdfErrMsg = this.warning_message[i].value;
          } else {
            this.bookViewForm.controls['isbnEbookuPdf'].setValue(this.isbn_ebook_updf);
          }
        }
        if (this.f.isbnPrinthb.value == null) {
          if (this.warning_message[i].fieldName == 'isbnPrinthb') {
            this.isbnHardbackErrMsg = this.warning_message[i].value;
          } else {
            this.bookViewForm.controls['isbnPrinthb'].setValue(this.isbn_hardback);
          }
        }
        if (this.f.isbnPrintOther.value == null) {
          if (this.warning_message[i].fieldName == 'isbnPrintOther') {
            this.isbnOtherPrintErrMsg = this.warning_message[i].value;
          } else {
            this.bookViewForm.controls['isbnPrintOther'].setValue(this.isbn_other_print);
          }
        }
        if (this.f.isbnPrintpb.value == null) {
          if (this.warning_message[i].fieldName == 'isbnPrintpb') {
            this.isbnPaperbackErrMsg = this.warning_message[i].value;
          } else {
            this.bookViewForm.controls['isbnPrintpb'].setValue(this.isbn_paperback);
          }
        }
        if (this.f.extentBK.value == null) {
          if (this.warning_message[i].fieldName == 'extentBK') {
            this.extentBKErrMsg = this.warning_message[i].value;
          } else {
            this.bookViewForm.controls['extentBK'].setValue(this.extent);
          }
        }
      }
    }

    this.filteredOptions = this.bookViewForm.controls.country.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  get f() {
    return this.bookViewForm.controls;
  }

  validateEditionRevision() {
    this.ediRevNbrErrMsg = "";
    if (Math.sign(this.f.editionRevisionNo.value) > 0) {
      this.bookViewForm.controls['editionRevisionNo'].setValue(this.bookViewForm.get('editionRevisionNo').value);
    } else {
      this.ediRevNbrErrMsg = "Please change the edition revision number to a positive integer or leave blank.";
    }
  };

  validateEditionStat() {
    this.ediRevStatErrMsg = "";
    if (Math.sign(this.f.editionRevisionNo.value) > 0) {
      if (this.bookViewForm.get('editionRevisionStatement').value == null || this.bookViewForm.get('editionRevisionStatement').value == " ") {
        this.ediRevStatErrMsg = "Please enter an edition statement.";
      } else {
        this.ediRevStatErrMsg = "";
      }
    }
  }

  /*istanbul ignore text*/
  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.countryData.filter(option =>
      option.name.toLowerCase().includes(filterValue) ||
      option.synonym && JSON.stringify(option.synonym).toLowerCase().includes(filterValue) ||
      option.iso_code && option.iso_code.toLowerCase().includes(filterValue)
    );
  }

  getAppName() {
    this.appProcessService.getDeployedApplicationsByName(this.appName)
      .subscribe((appDetails: AppDefinitionRepresentation) => {
        console.log("appDetails", appDetails);
        if (appDetails) {
          this.searchProcess(appDetails.id)
        } else {
          this.errorMessage = 'No workflow application found';
        }

      }, error => {
        console.log('Error :', error);
        this.errorMessage = 'No workflow application found';
      });
  }

  searchProcess(appId) {
    this.processService.getProcessDefinitions(appId)
      .subscribe((processDefinitionRepresentation: ProcessDefinitionRepresentation[]) => {
        processDefinitionRepresentation.forEach(res => {
          if (this.saveRecordProcessKey === res.key) {
            this.saveProcessDefinationId = res.id;
          } else {
            this.errorMessage = 'No workflow process  found';
          }
        });
      }, error => {
        console.log('Error: ', error);
      });
  }

  getCountry() {
    this.authorizationService.getCountryList(this.token).subscribe(res => {
      this.countryData = res.countryList;
      console.log("Country Data", this.countryData);
    });
  }


  publishData() {
    this.submitted = true;
    this.touchAllElements(this.bookViewForm);
    if (this.bookViewForm.invalid) {
      return true;
    }
    this.bookViewForm.get('copyRightHolder').setValue(this.bookViewForm.get('copyRightHolder').value.trim());
    this.copyStat = ' ' + this.bookViewForm.get('copyRightHolder').value + ' ' + this.bookViewForm.get('copyRightYear').value;
    this.bookViewForm.get('copyRightStatement').setValue(this.copyStat.trim());
    console.log("Book View Form", this.bookViewForm.value);
  }

  saveData() {
    for (var i = 0; i < this.countryData.length; i++) {
      if (this.f.country.value === this.countryData[i].name) {
        this.code = this.bookViewForm.controls['countryCode'].setValue(this.countryData[i].iso_code)
      }
    }
    this.copyStat = ' ' + this.bookViewForm.get('copyRightHolder').value + ' ' + this.bookViewForm.get('copyRightYear').value;
    this.bookViewForm.get('copyRightStatement').setValue(this.copyStat.trim());
    const name = 'Save Record ' + (moment(new Date()).format('DD-MM-YYYY HH:mm'));
    const startFormValues = {
      docId: this.docId,
      country: this.f.country.value,
      countryCode: this.f.countryCode.value ? this.f.countryCode.value : this.code,
      collectionModuleBK: this.f.collectionModuleBK.value,
      doi: this.f.doi.value,
      copyRightHolder: this.f.copyRightHolder.value,
      copyRightYear: this.f.copyRightYear.value,
      copyRightStatement: '© ' + this.f.copyRightStatement.value,
      editionNumberBK: this.f.editionNumberBK.value,
      editionRevisionNo: this.f.editionRevisionNo.value,
      editionRevisionStatement: this.f.editionRevisionStatement.value,
      isbnFirstEdition: this.f.isbnFirstEdition.value,
      extentBK: this.f.extentBK.value,
      isbnElectronic: this.f.isbnElectronic.value,
      isbnEbookePub: this.f.isbnEbookePub.value,
      isbnEbookuPdf: this.f.isbnEbookuPdf.value,
      isbnPrinthb: this.f.isbnPrinthb.value,
      isbnPrintOther: this.f.isbnPrintOther.value,
      isbnPrintpb: this.f.isbnPrintpb.value
    };
    this.processService.startProcess(this.saveProcessDefinationId, name, null, startFormValues)
      .subscribe((processInstance: ProcessInstance) => {
        const variables = processInstance.variables;
        variables.forEach(ele => {
          ele['name'] === 'message' ? this.message = ele['value'] : '';
        });
        if (this.message) {
          this.successMessage = this.message;
        }
      }, error => {
        console.log('Error: ', error);
      });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
    this.storageService.clear();
  }

  touchAllElements(formGroup: FormGroup) {
    Object.keys(formGroup["controls"]).forEach(element => {
      formGroup.get(element).markAsTouched();
    });
  }

  allowOnlyNumber(eventInstance) {
    eventInstance = eventInstance || window.event;
    var key = eventInstance.keyCode;
    console.log("print ekey ..", key, eventInstance.code);
    if ((47 < key) && (key < 58) || key == 8 || key == 189 || key == 109) {
      return true;
    } else {
      if (eventInstance.preventDefault)
        eventInstance.preventDefault();
      eventInstance.returnValue = false;
      return false;
    }
  }


}
