import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { SubscriptionService } from '../services/subscription.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-subscription-account',
  templateUrl: './subscription-account.component.html',
  styleUrls: ['./subscription-account.component.css']
})
export class SubscriptionAccountComponent implements OnInit {

  subscriberAccountForm;
   subTypeList: any[] = [];
   subDuraytionList: any[] = [];
   billingData;
   doctorName: string;
   clinicName: string;
   address: string;
   telephone: string;
   subscriptionType: string;
   subscriptionDuration: string;

  constructor(private _fb: FormBuilder, private toastrService: ToastrService
    , private subscriptionService: SubscriptionService,private router: Router) { }

  ngOnInit() {
    this.getBillingInfo();
    this.getSubscriptionType();
    this.getSubscriptionDuration();

    this.subscriberAccountForm = this._fb.group({
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      email_user_id: ["", [Validators.required]],
      dob: ["", [Validators.required]],
      national_id: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      address: ["", [Validators.required]],
      address_2: ["", [Validators.required]],
      postcode: ["", [Validators.required]],
      state: ["", [Validators.required]],
      country: ["", [Validators.required]],
      mobile_no: ["", [Validators.required]],
      phone_no: ["", [Validators.required]],
      fax_no: ["", [Validators.required]],
      subscription_type: ["", [Validators.required]],
      subscription_duration: ["", [Validators.required]],
    });

  }


  getBillingInfo(){    
    this.subscriptionService.getBillingInfo().subscribe(response => {
      // console.log(response);
      this.billingData = response.data[0];
      console.log(this.billingData);
      sessionStorage.setItem('billingData',JSON.stringify(this.billingData));
       this.doctorName = this.billingData.doctor_name;
       this.clinicName = this.billingData.name_of_clinic;
       this.address = this.billingData.address_of_clinic_1;
       this.telephone = this.billingData.d_phone_no;

      this.subscriberAccountForm.patchValue({
        first_name: this.billingData.first_name,
        last_name: this.billingData.last_name,
        email_user_id: this.billingData.email_user_id,
        gender: this.billingData.gender,
        dob: formatDate(this.billingData.dob, 'dd-MM-yyyy', 'en'),
        national_id: this.billingData.national_id,
        address: this.billingData.address,
        address_2: this.billingData.address_2,
        postcode: this.billingData.postcode,
        state: this.billingData.state,
        country: this.billingData.country,
        mobile_no: this.billingData.mobile_no,
        phone_no: this.billingData.phone_no,
        fax_no: this.billingData.fax_no,
        
      });

    });
  }


  onSubmit(){
    let billingValues = this.subscriberAccountForm.value;
    // billingValues["user_id"] = this.user_id;
    console.log(billingValues); 
    sessionStorage.setItem('billingValues',JSON.stringify(billingValues));
 
    this.subscriptionType = billingValues.subscription_type;
    this.subscriptionDuration = billingValues.subscription_duration;

    this. getSubscriptionAmount(this.subscriptionType, this.subscriptionDuration);
    } 

    getSubscriptionAmount(subscriptionType,subscriptionDuration){
      this.subscriptionService.getSubscriptionAmount(subscriptionType,subscriptionDuration).subscribe(amount => {
        console.log(amount);
        sessionStorage.setItem('amount',JSON.stringify(amount.data));
        this.router.navigate(['/subscription-order']);  
      });
    }
    
  /*getInvoiceNo(){    
    this.subscriptionService.getInvoiceNo().subscribe(invoiceNo => {
      console.log(invoiceNo);     
        
    });
  }*/

  getSubscriptionType(){    
    this.subscriptionService.getSubscriptionType().subscribe(response => {
      // console.log(response);
      this.subTypeList = response.data;
    });
  }

  getSubscriptionDuration(){    
    this.subscriptionService.getSubscriptionDuration().subscribe(response => {
      // console.log(response);
      this.subDuraytionList = response.data;
    });
  }

}
