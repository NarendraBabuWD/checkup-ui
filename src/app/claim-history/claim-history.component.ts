import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ClaimService } from '../services/claim.service';
import { HttpService } from '../services/http.service';
import appConstants from '../config/app.constants';
import * as moment from 'moment';

@Component({
  selector: 'app-claim-history',
  templateUrl: './claim-history.component.html',
  styleUrls: ['./claim-history.component.css']
})
export class ClaimHistoryComponent implements OnInit {
  public historyView: FormGroup;
  listViewUi: boolean = false;
  dataViewList:  any[] = [];
  total: any = ''; 
  totalPaid: any = '';
  constructor(private _fb: FormBuilder, private httpService: HttpService,
    private claimService: ClaimService,) { }
    TableHeadings = ['Subscriber','Date','Purpose','Released', 'Charged (RM)','Paid (RM)'];
  ngOnInit() {
    this.historyView = this._fb.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]]
  });
  }
  /*onSubmit( model: FormGroup ) {
    this.dataViewList = [];
    this.total = 0;
    this.totalPaid = 0;
    this.claimService.claimHistory( model.value ).subscribe( response => {
         this.listViewUi = true;
        this.dataViewList = response.data; 
        for(var i in response.data) { 
          this.total += response.data[i].charge; 
          this.totalPaid += response.data[i].paid; 
        }   
    });
} */

onSubmit( model: FormGroup ) {
  this.dataViewList = [];
  this.total = 0;
  this.totalPaid = 0;
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getClaimListing', 
  {  date_from: moment(model.value.fromDate).utc().format('YYYY-MM-DD'),
     date_to: moment(model.value.toDate).utc().format('YYYY-MM-DD')
  }
  ).subscribe(response => {
    console.log(response);
        this.listViewUi = true;
        this.dataViewList = response.data; 
        // for(var i in response.data) {
          for(let i = 0; i < response.data.length; i++){ 
          this.total += parseFloat(response.data[i].amount); 
          this.totalPaid += parseFloat(response.data[i].amount);
        } 
  });
} 

}
