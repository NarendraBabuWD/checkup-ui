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
export class ClaimService {
    // private apiUrlBatchClaim = Apps.apiBaseUrl +'get_claim_details';
    private apiUrlBatchClaim = Apps.apiBaseUrl +'claim_module_details';
    private apiUrlIndividualClaim = Apps.apiBaseUrl +'claim_module_data_patient';
    private apiUrlGetPatients = Apps.apiBaseUrl +'get_patients';
    private apiUrlInvoiceNo = Apps.apiBaseUrl +'ID';
    private apiUrlSubmitClaim = Apps.apiBaseUrl +'update';
    private apiUrlClaimHistory = Apps.apiBaseUrl +'claim_module_details'; 
    private apiUrlClaimCreate = Apps.apiBaseUrl + 'create_claim_request';
    private apiUrlClaimInfoList = Apps.apiBaseUrl + 'get_sub_info';
   
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

  
     batchClaim(batchClaim): Observable<any> {
      let fromDate = moment(batchClaim.fromDate).utc().format('YYYY-MM-DD');
      let toDate = moment(batchClaim.toDate).utc().format('YYYY-MM-DD');
    let requestData: any = [];

    requestData = {};
    requestData = {         
      user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,               
        start_date: fromDate,
        end_date: toDate,
        status: "New"
    };    
    // console.log(requestData); 
    return this.http.post(this.apiUrlBatchClaim, requestData);
  }

  getPatients(): Observable<any> {
    let requestData: any = [];
    requestData = {};
    requestData = {
        user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id
    };
    return this.http.post(this.apiUrlGetPatients, requestData);
  }
 individualClaim(individualView): Observable<any> {
    var str = individualView.patientmrn;
    var array = str.split(" ");
     
  let fromDate = moment(individualView.individualFromDate).format('YYYY-MM-DD');
  let toDate = moment(individualView.individualToDate).format('YYYY-MM-DD');
  let patient = array[0];
  let mrn = array[1];

    let requestData = {};
    requestData = {                        
        start_date: fromDate,
        end_date: toDate,
        patient: patient,
        status: "New",
        user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,
        mrn: mrn
      };    
    // console.log(requestData); 
    return this.http.post(this.apiUrlIndividualClaim, requestData);
  }
  
  public getInvoiceNo(){
    return this.http.get(this.apiUrlInvoiceNo);
  }

  claimSubmit(claimSubmit, invoiceNo): Observable<any> {
    let requestOptions = { 
        data: [{
          user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,
          date: claimSubmit.date,
          subscriber: claimSubmit.subscriber,
          mrn: claimSubmit.mrn,
          status: 'Claimed',
          invoice_no: invoiceNo
        }]
    };    
    // console.log(requestOptions); 
    return this.http.post(this.apiUrlSubmitClaim, requestOptions);
  }

  claimHistory(claimHistory): Observable<any> {
    let requestData: any = [];

    requestData = {};
    requestData = { 
         user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,
         start_date: claimHistory.fromDate,
         end_date: claimHistory.toDate,
         status: "Claimed,Released"
    };    
    // console.log(requestData); 
    return this.http.post(this.apiUrlClaimHistory, requestData);
  }

  claimCreate(claimCreate): Observable<any> {
    
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

var todayDate = yyyy+'-'+mm+'-'+dd;

// console.log(todayDate);
    let requestData: any = [];

    requestData = {};
    requestData = { 
         doctor_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,
         subscriber_id: claimCreate.patient,
         requested_date: todayDate
    };    
    // console.log(requestData); 
    return this.http.post(this.apiUrlClaimCreate, requestData);
  }

  getClaimInfo(): Observable<any> {

    let requestData: any = [];
    requestData = {};
    requestData = { 
         doctor_id: JSON.parse(sessionStorage.getItem("userdata")).user_id
   };     
    return this.http.post(this.apiUrlClaimInfoList, requestData);
  }
}
