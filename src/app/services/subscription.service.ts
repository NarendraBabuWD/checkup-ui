import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Apps from '../config/app.constants';
import * as moment from 'moment';


// import 'rxjs/Rx';
// import 'rxjs/add/operator/map';
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

    private apiUrlInvoiceNo = Apps.apiBaseUrl +'ID';
    private apiUrlGetBillingInfo = Apps.apiBaseUrl +'get_billing_info';
    private apiUrlSubscriptionType = Apps.apiBaseUrl +'subscription_type';
    private apiUrlSubscriptionDuration = Apps.apiBaseUrl +'subscription_duration';
    private apiUrlSubAmt = Apps.apiBaseUrl +'get_subscription_amount';
    private apiUrlAddBillingInfo = Apps.apiBaseUrl +'create_billing_info';


    post(arg0: string, arg1: string) {
    throw new Error("Method not implemented.");
  }
  
  headers= new HttpHeaders({ 
    'Content-Type': 'application/json; charset=utf-8 '
  });
  options = { headers: this.headers };
  
  
  commonPost(url, body): Observable<any> {
    return this.http.post(url,
      body, this.options);
  }
  
  constructor(private http:HttpClient,
     ) { }


public getInvoiceNo(){
        return this.http.get(this.apiUrlInvoiceNo);
    }

getBillingInfo(): Observable<any> {
  
  let requestData = {};
  requestData = { 
       doctor_id: JSON.parse(sessionStorage.getItem("userdata")).doctor_id,
       user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id
 };    
  
  return this.http.post(this.apiUrlGetBillingInfo, requestData);
}

getSubscriptionType(): Observable<any> {  
  let requestData = {};
  requestData = { 
       company_name: "iHEAL Medical Centre"
 };       
  return this.http.post(this.apiUrlSubscriptionType, requestData);
}


getSubscriptionDuration(): Observable<any> {  
    let requestData = {};
    requestData = { 
         company_name: "iHEAL Medical Centre"
   };       
    return this.http.post(this.apiUrlSubscriptionDuration, requestData);
  }

  getSubscriptionAmount(subscriptionType,subscriptionDuration): Observable<any> {  
    let requestData = {};
    requestData = { 
         company_name: "iHEAL Medical Centre",
         subscription_type: subscriptionType,
         subscription_duration: subscriptionDuration
   };       
    return this.http.post(this.apiUrlSubAmt, requestData);
  }

  createBillingInfo(): Observable<any> {  
    let amount = JSON.parse(sessionStorage.getItem("amount"));
    let billingValues = JSON.parse(sessionStorage.getItem("billingValues"));
    let billingData = JSON.parse(sessionStorage.getItem("billingData"));
    let requestData = {};
    requestData = { 
         user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,
         subscriber_name: JSON.parse(sessionStorage.getItem("userdata")).firstname+" "+JSON.parse(sessionStorage.getItem("userdata")).lastname,
         address: billingValues.address+" "+billingValues.address_2+" "+billingValues.postcode,
         subscriber_type: billingValues.subscription_type,
         subscriber_period: "",
         subscriber_duration: billingValues.subscription_duration,
         total_amount: amount[0].amount,
         invoice_no: "",
         account_no: amount[0].account_no,
         dilling_date: moment().format("DD/MM/YYYY"),
         tax: amount[0].tax,
         doctor_id: JSON.parse(sessionStorage.getItem("userdata")).doctor_id,
         doctor_name: billingData.doctor_name
   };       
   console.log(requestData);
   
    return this.http.post(this.apiUrlAddBillingInfo, requestData);
  }

}
