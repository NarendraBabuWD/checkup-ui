import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ClaimService } from '../services/claim.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-patients',
  templateUrl: './request-patients.component.html',
  styleUrls: ['./request-patients.component.css']
})
export class RequestPatientsComponent implements OnInit {
  filterPatientList: any[] = [];
  
  public claimRequest: FormGroup;
  constructor(private _fb: FormBuilder, private router: Router,
    private claimService: ClaimService,  private toastrService: ToastrService) { }

  ngOnInit() {
    this.claimRequest = this._fb.group({
      patient: ['', [Validators.required]]
  });
  this.claimService.getClaimInfo().subscribe(disList => {
    console.log(disList.data);
    this.filterPatientList = [];         
    // let arr = Object.keys(disList).map((district) => disList[district])
  
   for (let i = 0; i < disList.data.length ; i++) {
        this.filterPatientList.push({ patient: disList.data[i].user_id, value: disList.data[i].first_name+'-'+disList.data[i].user_id });
    }        
    
  });
  }

  onSubmit( model: FormGroup ) {
    this.claimService.claimCreate( model.value ).subscribe( response => {
        let message = 'Patient Requested Successfully';
        this.toastrService.success(message); 
        this.router.navigate(['/claim-submission']);               
    },
        error => {
          //   this.alertNotSuccess();
            
        } );

} 
}
