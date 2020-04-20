import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { SubscriptionService } from '../services/subscription.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HttpService } from '../services/http.service';
import appConstants from '../config/app.constants';
import { UtilService } from '../services/util.service';

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
   billingEndDate: string;
   total;

  constructor(private _fb: FormBuilder, private toastrService: ToastrService,private utilService: UtilService,
      private httpService: HttpService
    , private subscriptionService: SubscriptionService,private router: Router) { }


  ngOnInit() {

    this.billingValues = JSON.parse(sessionStorage.getItem("doSubmitSubscription"));
    this.amount = JSON.parse(sessionStorage.getItem("package"));
    this.billingData = JSON.parse(sessionStorage.getItem("billingData"));
    // console.log(this.billingValues);
    // console.log(this.amount);
    // console.log(this.billingData);
    // this. getInvoiceNo();
    this.doctorName = this.billingData.doctor_name;
    this.clinicName = this.billingData.doctor_clinic;
    // this.clinicAddress = this.billingData.address_of_clinic_1;
    this.clinicAddress = `${this.billingData.doctor_address},${this.billingData.doctor_address2},${this.billingData.doctor_state},${this.billingData.doctor_postcode},${this.billingData.doctor_country}`;

    this.first_name = this.billingData.firstname;
    this.last_name = this.billingData.lastname;
    // this.address = `${this.billingData.address},${this.billingData.address2},${this.billingData.state},${this.billingData.postcode},${this.billingData.country}`;

    this.billingDate = moment().format("DD/MM/YYYY");
    let new_date = moment(this.billingDate, "DD/MM/YYYY");
    new_date.add(parseInt(this.amount.duration), 'days');
    this.billingEndDate = moment(new_date).format("DD/MM/YYYY");
    this.address = this.billingData.address;
    this.address2 = this.billingData.address2;
    this.postcode = this.billingData.postcode;
    this.state = this.billingData.state;
    this.country = this.billingData.country;
    this.subscription_type = this.amount.package_name;
    this.subscription_duration = this.amount.duration;
    this.invoice = this.billingValues.order_id;
    this.amountVal = this.billingValues.amount;

    this.tax = "0.00";
    this.total = parseFloat(this.amountVal + this.tax).toFixed(2);
    /*this.amountVal = this.amount[0].amount;
    this.tax = this.amount[0].tax;
    this.account_no = this.amount[0].account_no;
    this.total = this.amountVal + this.tax;*/
  }

   /*getInvoiceNo(){    
    this.subscriptionService.getInvoiceNo().subscribe(invoiceNo => {
      // console.log(invoiceNo['data']);     
        this.invoice = invoiceNo['data'];
        sessionStorage.setItem('invoiceNo',JSON.stringify(this.invoice));
        this.billingDate = moment().format("DD/MM/YYYY");
    });
  }*/

  goToHome(){
    sessionStorage.removeItem("doSubmitSubscription"); 
    sessionStorage.removeItem("amount"); 
    sessionStorage.removeItem("billingData"); 
    this.router.navigate(['/home']);  
  }
  goToSubscription(){
    sessionStorage.removeItem("doSubmitSubscription"); 
    sessionStorage.removeItem("amount"); 
    sessionStorage.removeItem("billingData"); 
    this.router.navigate(['/subscription-account']); 
  }

 /* addBillingInfo(){
    this.subscriptionService.createBillingInfo().subscribe(response => {
      console.log(response);     
      
    });
  }*/
  updatePaymentInfo(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'updatePaymentInfo', 
    {    transaction_id: this.invoice,  
         payment_reference: "",
         payment_status: "success"
        }
    ).subscribe(data => {
      console.log(data);
      this.utilService.toastrSuccess("Payment Updated Sucessfully", "Payment Sucessfully");
      this.router.navigate(['home']);
    }, (err) => {
      console.log(err);
      this.utilService.toastrError("Payment Updation Failed !.", "Payment Failed");
    });
  }
}
