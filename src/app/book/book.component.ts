import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppsProcessService, AlfrescoApiService } from '@alfresco/adf-core';
import { ProcessService, ProcessInstance } from '@alfresco/adf-process-services';
import { AppDefinitionRepresentation, ProcessDefinitionRepresentation } from '@alfresco/js-api';
import * as moment from 'moment';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  demoForm: FormGroup;
  countryCode: string;
  country: string;
  year: number;
  filteredOptions: Observable<string[]>;
  appName = 'POC-CMM';
  errorMessage: string = "";
  successMessage: string = "";
  saveRecordProcessKey = 'SaveRecord';
  saveProcessDefinationId = "";
  subject;
  doi;
  docId;
  message: string = "";
  countryData = [];
  code: any = "";

  constructor(private appProcessService: AppsProcessService,
    private processService: ProcessService, private formBuilder: FormBuilder,
    private apiService: AlfrescoApiService, private dataService: DataService) {
    this.demoForm = this.formBuilder.group({
      country: ['', Validators.required],
      countryCode: [''],
      subject: [''],
      doi: ['', Validators.required],
      copyRightYear: ['', [Validators.required, Validators.pattern('[0-9]{4}'), Validators.min(1700), Validators.max(2020)]]
    });

  }

  ngOnInit() {
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
    setTimeout(() => {
      this.getAppName();
    }, 100);
    this.getCountry();
    this.demoForm.controls['subject'].setValue(this.subject);
    this.demoForm.controls['doi'].setValue(this.doi);
    this.filteredOptions = this.demoForm.controls.country.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  /*istanbul ignore text*/
  private _filter(value: string): any[] {
    const filterValue = value;
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
    this.apiService.getInstance().webScript.executeWebScript('GET', 'countries', null, 'activiti-app',
      'api/enterprise', null).then(res => {
        this.countryData = res.countryList;
        console.log("Country Data", this.countryData);
      });
  }

  get f() {
    return this.demoForm.controls;
  }

  onSubmit() {
    if (this.demoForm.invalid) {
      return true;
    }
    for (var i = 0; i < this.countryData.length; i++) {
      if (this.f.country.value === this.countryData[i].name) {
        this.code = this.demoForm.controls['countryCode'].setValue(this.countryData[i].iso_code)
      }
    }
    console.log("DemoForm", this.demoForm.value);
    const name = 'Save Record ' + (moment(new Date()).format('DD-MM-YYYY HH:mm'));
    const startFormValues = {
      docId: this.docId,
      country: this.f.country.value,
      countryCode: this.f.countryCode.value ? this.f.countryCode.value : this.code,
      subject: this.f.subject.value,
      doi: this.f.doi.value,
      copyRightYear: this.f.copyRightYear.value
    };
    this.processService.startProcess(this.saveProcessDefinationId, name, null, startFormValues)
      .subscribe((processInstance: ProcessInstance) => {
        const variables = processInstance.variables;
        variables.forEach(ele => {
          ele['name'] === 'message' ? this.message = ele['value'] : '';
        });
        if (this.message) {
          this.successMessage = 'Record Saved Successfully';
        } else {
          this.successMessage = 'Error during Record saving';
        }
      }, error => {
        console.log('Error: ', error);
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

