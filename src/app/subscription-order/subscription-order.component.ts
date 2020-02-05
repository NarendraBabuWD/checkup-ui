import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { SubscriptionService } from '../services/subscription.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-subscription-order',
  templateUrl: './subscription-order.component.html',
  styleUrls: ['./subscription-order.component.css']
})
export class SubscriptionOrderComponent implements OnInit {

   billingValues;
   amount;
   billingData;
   doctorName: string;
   clinicName: string;
   clinicAddress: string;
   telephone: string;
   subscriptionType: string;
   subscriptionDuration: string;
   first_name: string;
   last_name: string;
   address: string;
   address2: string;
   postcode: string;
   state: string;
   country: string;
   subscription_type: string;
   subscription_duration: string;
   amountVal: string;
   tax: string;
   account_no: string;
   invoice: string;
   billingDate: string;
   total;

  constructor(private _fb: FormBuilder, private toastrService: ToastrService
    , private subscriptionService: SubscriptionService,private router: Router) { }


  ngOnInit() {

    this.billingValues = JSON.parse(sessionStorage.getItem("billingValues"));
    this.amount = JSON.parse(sessionStorage.getItem("amount"));
    this.billingData = JSON.parse(sessionStorage.getItem("billingData"));
    console.log(this.billingValues);
    console.log(this.amount);
    console.log(this.billingData);
    this. getInvoiceNo();
    this.doctorName = this.billingData.doctor_name;
    this.clinicName = this.billingData.name_of_clinic;
    this.clinicAddress = this.billingData.address_of_clinic_1;
    this.first_name = this.billingValues.first_name;
    this.last_name = this.billingValues.last_name;
    this.address = this.billingValues.address;
    this.address2 = this.billingValues.address_2;
    this.postcode = this.billingValues.postcode;
    this.state = this.billingValues.state;
    this.country = this.billingValues.country;
    this.subscription_type = this.billingValues.subscription_type;
    this.subscription_duration = this.billingValues.subscription_duration;

    this.amountVal = this.amount[0].amount;
    this.tax = this.amount[0].tax;
    this.account_no = this.amount[0].account_no;
    this.total = this.amountVal + this.tax;
  }

   getInvoiceNo(){    
    this.subscriptionService.getInvoiceNo().subscribe(invoiceNo => {
      // console.log(invoiceNo['data']);     
        this.invoice = invoiceNo['data'];
        sessionStorage.setItem('invoiceNo',JSON.stringify(this.invoice));
        this.billingDate = moment().format("DD/MM/YYYY");
    });
  }

  goToHome(){
    sessionStorage.removeItem("billingValues"); 
    sessionStorage.removeItem("amount"); 
    sessionStorage.removeItem("billingData"); 
    this.router.navigate(['/home']);  
  }
  goToSubscription(){
    sessionStorage.removeItem("billingValues"); 
    sessionStorage.removeItem("amount"); 
    sessionStorage.removeItem("billingData"); 
    this.router.navigate(['/subscription-account']); 
  }

  addBillingInfo(){
    this.subscriptionService.createBillingInfo().subscribe(response => {
      console.log(response);     
      
    });
  }
}
