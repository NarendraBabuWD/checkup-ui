import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ClaimService } from '../services/claim.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

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
  batchViewForm: boolean = true;
  invoiceNo:any = '';
  currentDate: any = '';
  doctorId: any = '';
  doctorName: any = '';
  selectedValue: any = '';
  constructor(private _fb: FormBuilder,
    private claimService: ClaimService,  private toastrService: ToastrService) { }
  
  TableHeadings = ['Subscriber','MRN','Date','Purpose','Charge (RM)'];
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
this.claimService.getPatients().subscribe(disList => {
  // console.log(disList.data);
  this.filterPatientList = [];         
  // let arr = Object.keys(disList).map((district) => disList[district])

 for (let i = 0; i < disList.data.length ; i++) {
      this.filterPatientList.push({ label: disList.data[i].patient, value: disList.data[i].patient+' '+disList.data[i].mrn });
  }        
  
});
  }
  
  closeModalDialog(){
    this.display='none'; //set none css after close dialog
  }

  
  onSubmit( model: FormGroup ) {
    this.batchViewList = [];
    this.batchTotal = 0;
    this.batchviewUi = true;
    this.claimService.batchClaim( model.value ).subscribe( response => {
         
        console.log(response.data);   
        this.batchViewList = response.data;   
        for(var i in response.data) { this.batchTotal += response.data[i].charge; }
        console.log(this.batchTotal);        
    },
        error => {
          //   this.alertNotSuccess();            
        } );
} 

individualSubmit( model: FormGroup ) {
  this.batchViewList = [];
  this.batchTotal = 0;
  this.batchviewUi = true;
  this.claimService.individualClaim( model.value ).subscribe( response => {
       
      console.log(response.data);   
      this.batchViewList = response.data;   
      for(var i in response.data) { this.batchTotal += response.data[i].charge; }
      console.log(this.batchTotal);        
  },
      error => {
        //   this.alertNotSuccess();            
      } );
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
}
individual(){
  this.individualViewForm = true;
  this.batchViewForm = false;
  this.individualView.reset();
}

change(obj){
// console.log(obj);

  let updateItem = this.selectedData.find(this.findIndexToUpdate, obj.user_id);

  let index = this.selectedData.indexOf(updateItem);

  console.log(index);

  if(index > -1){
    this.selectedData.splice(index, 1);
  }
  else{
    this.selectedData.push(obj);
  }
// console.log(this.selectedData);

  // this.service.setList(this.selectedEmployees);

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
