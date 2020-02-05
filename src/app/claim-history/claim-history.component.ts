import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ClaimService } from '../services/claim.service';

@Component({
  selector: 'app-claim-history',
  templateUrl: './claim-history.component.html',
  styleUrls: ['./claim-history.component.css']
})
export class ClaimHistoryComponent implements OnInit {
  public historyView: FormGroup;
  listViewUi: boolean = false;
  dataViewList:  any[] = [];
  total: any = 0; 
  totalPaid: any = 0;
  constructor(private _fb: FormBuilder,
    private claimService: ClaimService,) { }
    TableHeadings = ['Subscriber','MRN','Date','Purpose','Charge (RM)','Paid (RM)','Release'];
  ngOnInit() {
    this.historyView = this._fb.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]]
  });
  }
  onSubmit( model: FormGroup ) {
    this.dataViewList = [];
    this.total = 0;
    this.totalPaid = 0;
    this.claimService.claimHistory( model.value ).subscribe( response => {
         this.listViewUi = true;
        // console.log(response.data);   
        this.dataViewList = response.data; 
        for(var i in response.data) { 
          this.total += response.data[i].charge; 
          this.totalPaid += response.data[i].paid; 
        }   
    },
        error => {
          //   this.alertNotSuccess();            
        } );
} 
}
