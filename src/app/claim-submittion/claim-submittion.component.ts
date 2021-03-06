import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ClaimService } from '../services/claim.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { HttpService } from '../services/http.service';
import appConstants from '../config/app.constants';
import * as moment from 'moment';
import swal from 'sweetalert2';


@Component({
  selector: 'app-claim-submittion',
  templateUrl: './claim-submittion.component.html',
  styleUrls: ['./claim-submittion.component.css']
})
export class ClaimSubmittionComponent implements OnInit {
  display='none';
  public batchView: FormGroup;
  public individualView: FormGroup;
  selectedData: any = [];
  batchViewList: any[] = [];
  filterPatientList: any[] = [];
  batchTotal: any = 0; 
  checkedTotal: any = 0;
  batchviewUi: boolean = false;
  individualViewForm: boolean = false;
  batchFlag: boolean = false;
  batchViewForm: boolean = true;
  invoiceNo:any = '';
  currentDate: any = '';
  doctorId: any = '';
  doctorName: any = '';
  selectedValue: any = '';
  selectedItemsList = [];
  checkedIDs = [];

  constructor(private _fb: FormBuilder, private httpService: HttpService,
    private claimService: ClaimService,  private toastrService: ToastrService) { }
  
  TableHeadings = ['','Subscriber','Date','Purpose','Charge (RM)'];
  /*TableContent:any = [
    {Subscriber:'test',MRN:'525524',Date:'2019-11-1',Purpose:'4th Quarter Review',Charge:'80'}
  ];*/
  ngOnInit() {
    // this. modalShow = 'btn-default';
    this.batchView = this._fb.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]]
  });

  this.individualView = this._fb.group({
    individualFromDate: ['', [Validators.required]],
    individualToDate: ['', [Validators.required]],
    patientmrn: ['']
});
this.getLoginDrpatInfo();
  }
  
  getLoginDrpatInfo(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getSubscriberList', { }).subscribe(patList => {
      // console.log(patList.data);
      this.filterPatientList = patList.data;
    });
  }

  closeModalDialog(){
    this.display='none'; //set none css after close dialog
  }

  
  onSubmit( model: FormGroup ) {
    this.batchViewList = [];
    this.batchTotal = 0;
    this.batchviewUi = true;
    console.log(model.value);
    this.batchFlag = true;
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getTransaction', 
      { date_from: moment(model.value.fromDate).utc().format('YYYY-MM-DD'),
        date_to: moment(model.value.toDate).utc().format('YYYY-MM-DD'),
        type: "1"
    }).subscribe(response => {
      console.log(response);
      this.batchViewList = response.data; 
      // for(var i in this.batchViewList) { this.batchTotal += parseFloat(this.batchViewList[i].amount); }
      });
} 

individualSubmit( model: FormGroup ) {
  this.batchViewList = [];
  this.batchTotal = 0;
  this.batchviewUi = true;
  this.batchFlag == false;
  console.log(model.value);
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getTransaction', 
      { date_from: moment(model.value.individualFromDate).utc().format('YYYY-MM-DD'),
        date_to: moment(model.value.individualToDate).utc().format('YYYY-MM-DD'),
        type: "2",
        sub_id: model.value.patientmrn
    }).subscribe(response => {
        console.log(response);
        this.batchViewList = response.data; 
        // for(var i in this.batchViewList) { this.batchTotal += parseFloat(this.batchViewList[i].amount); }
      });
  /*this.claimService.individualClaim( model.value ).subscribe( response => {
      console.log(response.data);   
      this.batchViewList = response.data;   
      for(var i in response.data) { this.batchTotal += response.data[i].charge; }
      console.log(this.batchTotal);        
  },
      error => {
        //   this.alertNotSuccess();            
      } );*/
} 

batchViewCancel(){
    this.batchViewList = [];
    this.batchTotal = 0;
    this.batchviewUi = false;
}
claimSubmission(){
  this.individualViewForm = false;
  this.batchViewForm = true;
  this.batchView.reset();
  this.individualView.reset();
}
individual(){
  this.individualViewForm = true;
  this.batchViewForm = false;
  this.individualView.reset();
  this.batchView.reset();
}
/*
change(obj){
// console.log(obj);

  let updateItem = this.selectedData.find(this.findIndexToUpdate, obj.transaction_id);

  let index = this.selectedData.indexOf(updateItem);

  console.log(index);

  if(index > -1){
    this.selectedData.splice(index, 1);
  }
  else{
    this.selectedData.push(obj);
  }
// console.log(this.selectedData);

}
*/

changeSelection() {
  this.fetchSelectedItems()
}

fetchSelectedItems() {
  this.batchTotal = 0;
  this.selectedItemsList = this.batchViewList.filter((value, index) => {
    return value.isChecked
  });
  console.log(this.selectedItemsList);

  for(var i in this.selectedItemsList) { this.batchTotal += parseFloat(this.batchViewList[i].amount); }

  /*this.selectedItemsList.map((value) => {
    
      this.checkedIDs.push(value.transaction_id);
    
  });*/
  // console.log(this.checkedIDs);
  
}

/*fetchCheckedIDs() {
  this.checkedIDs = []
  this.batchViewList.forEach((value, index) => {
    if (value.isChecked) {
      this.checkedIDs.push(value.transaction_id);
    }
  });
  console.log(this.checkedIDs);
}*/

/*onChange(f) {
  console.log(f.value);
  
  if (this.selectedData.indexOf(f.value) == -1) {
    this.selectedData.push(f.value);
  } else {
    this.selectedData.splice(this.selectedData.indexOf(f.value), 1);
  }
}*/


submitCheckedData(){
  this.checkedIDs = [];
  console.log(this.selectedItemsList);
 
  console.log(this.checkedIDs);
  console.log(this.batchFlag);
  
  if(this.selectedItemsList.length >= 1){
     for(let i=0; i < this.selectedItemsList.length; i++){
    this.checkedIDs.push(this.selectedItemsList[i].transaction_id);
  }
        this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'doClaimTransaction', 
        { transactions_id: this.checkedIDs
      }).subscribe(response => {
          console.log(response);
          swal.fire(
            'Success',
            'Your Claims have been submitted to OurCheckup. Please wait to hear back from us',
            'success'
          ).then(() => {
            // this.router.navigate(["empanelment-form"]);
            // this.batchView.reset();
            // this.individualView.reset();
            // this.batchViewList = [];
            // this.batchviewUi = false;
            if(this.batchFlag == true){
              this.getBatchData(this.batchView.value);
            } else {
              this.getIndividualData(this.individualView.value);
            }
          });
      });
  } else {
    let message = 'Please Select Atleast One Claim';
    this.toastrService.error(message);
  }
  
}

getBatchData(data) {
  this.batchViewList = [];
  this.batchTotal = 0;
  this.batchviewUi = true;
  console.log(data);
  // this.batchFlag = true;
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getTransaction', 
    { date_from: moment(data.fromDate).utc().format('YYYY-MM-DD'),
      date_to: moment(data.toDate).utc().format('YYYY-MM-DD'),
      type: "1"
  }).subscribe(response => {
    console.log(response);
    this.batchViewList = response.data; 
    // for(var i in this.batchViewList) { this.batchTotal += parseFloat(this.batchViewList[i].amount); }
    });
} 


getIndividualData(data) {
  this.batchViewList = [];
  this.batchTotal = 0;
  this.batchviewUi = true;
  console.log(data);
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getTransaction', 
      { date_from: moment(data.individualFromDate).utc().format('YYYY-MM-DD'),
        date_to: moment(data.individualToDate).utc().format('YYYY-MM-DD'),
        type: "2",
        sub_id: data.patientmrn
    }).subscribe(response => {
        console.log(response);
        this.batchViewList = response.data; 
        // for(var i in this.batchViewList) { this.batchTotal += parseFloat(this.batchViewList[i].amount); }
      });
  
} 

findIndexToUpdate(obj) { 
      return obj.QID === this;
}


openModalDialog(){
  this.display='block'; //Set block css
  this.doctorId = '';
  this.doctorName = '';
  this.currentDate = '';
  this.invoiceNo = '';
  this.currentDate = new Date();
  this.checkedTotal = 0;
  
  // console.log(this.selectedData);
  for(var i in this.selectedData) { this.checkedTotal += this.selectedData[i].charge; }
      console.log(this.checkedTotal);
  this.doctorId = JSON.parse(sessionStorage.getItem("userdata")).user_id;
  this.doctorName = JSON.parse(sessionStorage.getItem("userdata")).firstname +' '+JSON.parse(sessionStorage.getItem("userdata")).lastname;

  this.claimService.getInvoiceNo().subscribe(invoice => {
    
    // console.log(invoice.data);
    this.invoiceNo = invoice['data'];
    localStorage.setItem("invoiceNo", this.invoiceNo);

  });
 
}


updateClaim(){
  console.log(this.selectedData);
  let invoicenum = localStorage.getItem("invoiceNo");
  console.log(invoicenum);
  
  for ( let k = 0; k < this.selectedData.length; k++ ) {
        this.claimService.claimSubmit( this.selectedData[k],
          invoicenum ).subscribe( response => {
            // console.log(response);
                   
            } );
    
}
let message = 'Claim Module';
            this.toastrService.success(message);  
}

}
