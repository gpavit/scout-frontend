import { Component, OnInit, OnChanges } from '@angular/core';
import { AppsProcessService } from '@alfresco/adf-core';
import { ProcessService, ProcessInstance } from '@alfresco/adf-process-services';
import { AppDefinitionRepresentation, ProcessDefinitionRepresentation, ReportApi } from '@alfresco/js-api';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'app/services/data.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnChanges {
  subject;
  doi;
  docId;
  editionNoBK;
  editionRevisionNo;
  editionRevisionStatement;
  isbnFirstEdition;
  isbnElectronic;
  isbnEbookePub;
  isbnEbookuPdf;
  isbnPrinthb;
  isbnPrintOther;
  isbnPrintpb;
  extent;
  message: string = "";
  generalMessage: string = "";
  general_message: any = "";
  general_error: string = "";
  errMsg: string = "";
  gErrMsg: any;
  wErrMsg: any;
  warningMessage: any = "";
  warning_message: any = "";
  changedField: string = "";
  cField: any;
  searchRecordProcessKey = 'SearchRecord';
  appName = 'POC-CMM';
  errorMessage: string = "";
  searchProcessDefinationId = "";
  searchForm: FormGroup;
  public isbnData: any;
  public workIdData: any;

  constructor(private appProcessService: AppsProcessService, private processService: ProcessService,
    private router: Router, private formBuilder: FormBuilder, private dataService: DataService) {
  }

  ngOnInit() {
    this.getAppName();
    this.searchForm = this.formBuilder.group({
      isbn: [''],
      workId: ['']
    });
    this.dataService.docId$.subscribe(docData => {
      console.log("Doc Id", docData);
    });
    this.dataService.subject$.subscribe(subData => {
      console.log("Subject", subData);
    });
    this.dataService.doi$.subscribe(doiData => {
      console.log("Doi", doiData);
    });
    this.dataService.ediRevNbr$.subscribe(ediRevNbrData => {
      console.log("editionRevisionNbr", ediRevNbrData);
    });
    this.dataService.ediRevStat$.subscribe(ediRevStatData => {
      console.log("editionRevisionStatement", ediRevStatData);
    });
    this.dataService.isbnEdiRevNbr$.subscribe(isbnEdiRevNbrData => {
      console.log("isbnEditionRevisionNbr", isbnEdiRevNbrData);
    });
    this.dataService.warnMsg$.subscribe(warnMsgData => {
      console.log("warnMsgData", warnMsgData);
    });
    this.dataService.isbnOnline$.subscribe(onlineData => {
      console.log("onlineData", onlineData);
    });
    this.dataService.isbnPaperback$.subscribe(paperbackData => {
      console.log("paperbackData", paperbackData);
    });
    this.dataService.isbnHardback$.subscribe(hardbackData => {
      console.log("hardbackData", hardbackData);
    });
    this.dataService.isbnEbookEPub$.subscribe(epubData => {
      console.log("epubData", epubData);
    });
    this.dataService.isbnEbookUPdf$.subscribe(updfData => {
      console.log("updfData", updfData);
    });
    this.dataService.isbnOtherPrint$.subscribe(otherData => {
      console.log("otherData", otherData);
    });
    this.dataService.changeField$.subscribe(changeData => {
      console.log("ChangeData", changeData);
    });
    this.dataService.extent$.subscribe(extentData => {
      console.log("ExtentData", extentData);
    });
  }

  ngOnChanges() {
    this.onSearch();
  }

  get f() {
    return this.searchForm.controls;
  }

  getAppName() {
    this.appProcessService.getDeployedApplicationsByName(this.appName)
      .subscribe((appDetails: AppDefinitionRepresentation) => {
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
          if (this.searchRecordProcessKey === res.key) {
            this.searchProcessDefinationId = res.id;
          } else {
            this.errorMessage = 'No workflow process  found';
          }
        });
      }, error => {
        console.log('Error: ', error);
      });
  }

  onSearch() {
    this.errMsg = "";
    this.gErrMsg = "";
    this.wErrMsg = "";
    this.cField = "";
    this.message = "";
    this.generalMessage = "";
    this.warningMessage = "";
    this.changedField = "";
    const name = 'Search Record ' + (moment(new Date()).format('DD-MM-YYYY HH:mm'));
    const startFormValues = {
      isbn: this.f.isbn.value ? this.f.isbn.value : null,
      workId: this.f.workId.value ? this.f.workId.value : null
    };
    this.processService.startProcess(this.searchProcessDefinationId, name, null, startFormValues)
      .subscribe((processInstance: ProcessInstance) => {
        const variables = processInstance.variables;
        console.log("Variables", variables);
        variables.forEach(ele => {
          ele['name'] === 'collectionModuleBK' ? this.subject = ele['value'] : '';

          ele['name'] === 'doi' ? this.doi = ele['value'] : '';

          ele['name'] === 'docId' ? this.docId = ele['value'] : '';

          ele['name'] === 'editionNumberBK' ? this.editionNoBK = ele['value'] : '';

          ele['name'] === 'editionRevisionNo' ? this.editionRevisionNo = ele['value'] : '';

          ele['name'] === 'editionRevisionStatement' ? this.editionRevisionStatement = ele['value'] : '';

          ele['name'] === 'isbnFirstEdition' ? this.isbnFirstEdition = ele['value'] : '';

          ele['name'] === 'message' ? this.message = ele['value'] : '';

          ele['name'] === 'generalMessage' ? this.generalMessage = ele['value'] : '';

          ele['name'] === 'warningMessage' ? this.warningMessage = ele['value'] : '';

          ele['name'] == 'isbnElectronic' ? this.isbnElectronic = ele['value'] : '';

          ele['name'] == 'isbnEbookePub' ? this.isbnEbookePub = ele['value'] : '';

          ele['name'] == 'isbnEbookuPdf' ? this.isbnEbookuPdf = ele['value'] : '';

          ele['name'] == 'isbnPrinthb' ? this.isbnPrinthb = ele['value'] : '';

          ele['name'] == 'isbnPrintOther' ? this.isbnPrintOther = ele['value'] : '';

          ele['name'] == 'isbnPrintpb' ? this.isbnPrintpb = ele['value'] : '';

          ele['name'] == 'changedField' ? this.changedField = ele['value'] : '';

          ele['name'] == 'extentBK' ? this.extent = ele['value'] : '';

        });

          if (this.message && (this.f.isbn.value || this.f.workId.value)) {
            this.errMsg = this.message;
          } 
          if (this.message && !this.f.isbn.value && !this.f.workId.value) {
            this.errMsg = this.message;
          } 
          if (this.generalMessage && (this.f.isbn.value || this.f.workId.value)) {
            this.wErrMsg = "";
            this.cField = "";
            if (this.generalMessage) {
              this.general_message = JSON.parse(this.generalMessage);
              console.log("General Message", this.general_message);
              this.general_error = this.general_message.general_errors.general_error;
              var temp_list = [];
              for (let i = 0; i < this.general_message.general_errors.error.length; i++) {
                temp_list.push(this.general_message.general_errors.error[i]);
              }
              console.log("temp_list", temp_list);
              this.gErrMsg = temp_list;
            }
          } 
          if (this.warningMessage && (this.f.isbn.value || this.f.workId.value)) {
            this.gErrMsg = "";
            this.cField = "";
            var temp_values = [];
            if (this.warningMessage) {
              this.warning_message = JSON.parse(this.warningMessage);
              console.log("Warning Message", this.warning_message);
              for (let i = 0; i < this.warning_message.length; i++) {
                temp_values.push(this.warning_message[i]);
              }
              console.log("temp_values", temp_values);
              this.wErrMsg = temp_values;
            }
          } 
          if (this.changedField && (this.f.isbn.value || this.f.workId.value)) {
            this.wErrMsg = "";
            this.gErrMsg = "";
            var temp = [];
            if (this.changedField) {
              this.changedField = JSON.parse(this.changedField);
              for(let i = 0; i < this.changedField.length; i++) {
                temp.push(this.changedField[i])
              }
              this.cField = temp;
            }
          }
         
          this.dataService.getDocId(this.docId);
          this.dataService.getSubject(this.subject);
          this.dataService.getDoi(this.doi);
          this.dataService.getEdiNbrBK(this.editionNoBK);
          this.dataService.getEdiRevNbr(this.editionRevisionNo);
          this.dataService.getEdiRevStat(this.editionRevisionStatement);
          this.dataService.getIsbnEdiRevNbr(this.isbnFirstEdition);
          this.dataService.getWarnMsg(this.warningMessage);
          this.dataService.getIsbnOnline(this.isbnElectronic);
          this.dataService.getIsbnPaperback(this.isbnPrintpb);
          this.dataService.getIsbnHardback(this.isbnPrinthb);
          this.dataService.getIsbnEbookEPub(this.isbnEbookePub);
          this.dataService.getIsbnEbookUPdf(this.isbnEbookuPdf);
          this.dataService.getOtherPrint(this.isbnPrintOther);
          this.dataService.getChangeField(this.changedField);
          this.dataService.getExtent(this.extent);
//          this.gotoLink();
        
      }, error => {
        console.log('Error: ', error);
      });
  }

  gotoLink() {
    this.router.navigate(['/book-view']);
  }

  close() {
    if(this.warningMessage || this.changedField) {
      this.dataService.getDocId(this.docId);
      this.dataService.getSubject(this.subject);
      this.dataService.getDoi(this.doi);
      this.dataService.getEdiNbrBK(this.editionNoBK);
      this.dataService.getEdiRevNbr(this.editionRevisionNo);
      this.dataService.getEdiRevStat(this.editionRevisionStatement);
      this.dataService.getIsbnEdiRevNbr(this.isbnFirstEdition);
      this.dataService.getWarnMsg(this.warningMessage);
      this.dataService.getIsbnOnline(this.isbnElectronic);
      this.dataService.getIsbnPaperback(this.isbnPrintpb);
      this.dataService.getIsbnHardback(this.isbnPrinthb);
      this.dataService.getIsbnEbookEPub(this.isbnEbookePub);
      this.dataService.getIsbnEbookUPdf(this.isbnEbookuPdf);
      this.dataService.getOtherPrint(this.isbnPrintOther);
      this.dataService.getChangeField(this.changedField);
      this.dataService.getExtent(this.extent);
      this.gotoLink();
    }
    else if(this.generalMessage) {
      console.log("Do Nothing!")
    }
  }
}

