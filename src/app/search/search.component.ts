import { Component, OnInit } from '@angular/core';
import { AppsProcessService } from '@alfresco/adf-core';
import { ProcessService, ProcessInstance } from '@alfresco/adf-process-services';
import { AppDefinitionRepresentation, ProcessDefinitionRepresentation } from '@alfresco/js-api';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  subject;
  doi;
  docId;
  message: string = "";
  errMsg: string = "";
  searchRecordProcessKey = 'SearchRecord';
  appName='POC-CMM';
  errorMessage: string = "";
  searchProcessDefinationId = "";
  searchForm: FormGroup;
  public isbnData: any;
  public workIdData: any;

  constructor(private appProcessService:AppsProcessService, private processService: ProcessService,
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
  }

  get f() {
    return this.searchForm.controls;
  }

  getAppName() {
    this.appProcessService.getDeployedApplicationsByName(this.appName)
    .subscribe((appDetails:AppDefinitionRepresentation)=>{
      if(appDetails){
        this.searchProcess(appDetails.id)
      }else{
        this.errorMessage='No workflow application found';
      }
      
    },error=>{
      console.log('Error :' , error);
      this.errorMessage='No workflow application found';
    });
  }

  searchProcess(appId){
    this.processService.getProcessDefinitions(appId)
    .subscribe((processDefinitionRepresentation: ProcessDefinitionRepresentation[]) => {
      processDefinitionRepresentation.forEach(res => {
        if (this.searchRecordProcessKey === res.key) {
          this.searchProcessDefinationId = res.id;
        } else {
          this.errorMessage='No workflow process  found';
        }
      });
    }, error => {
      console.log('Error: ', error);
    });
  }

  onSearch() {
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
          ele['name'] === 'subject' ? this.subject = ele['value'] : '';

          ele['name'] === 'doi' ? this.doi = ele['value'] : '';

          ele ['name'] === 'docId' ? this.docId = ele['value'] : '';

          ele ['name'] === 'message' ? this.message = ele['value'] : '';
        });
        if (this.message && (this.f.isbn.value || this.f.workId.value)) {
          this.errMsg = "Record not found for the ISBN/WorkID";
        } else if(this.message && !this.f.isbn.value && !this.f.workId.value) {
          this.errMsg = "Please Provide Search Criteria";
        } else {
          this.dataService.getDocId(this.docId);
          this.dataService.getSubject(this.subject);
          this.dataService.getDoi(this.doi);
          this.gotoLink();
        }
      }, error => {
        console.log('Error: ', error);
      });
  }

  gotoLink() {
    this.router.navigate(['/book']);
  }

}

