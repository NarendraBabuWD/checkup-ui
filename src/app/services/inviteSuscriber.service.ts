import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Apps from '../config/app.constants';
import { sha256 } from 'js-sha256';


// import 'rxjs/Rx';
// import 'rxjs/add/operator/map';
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class InviteSubscriberService {
    private apiUrlUpdateUserFcmToken = Apps.apiBaseUrl +'update_user_fcm_token';
    private apiUrlInviteSub = Apps.apiBaseUrl +'push_fcm_notification';
    private apiUrlGetDoctorData = Apps.apiBaseUrl + 'get_doctor_details';
    private apiUrlGetEmpanelmentStatus = Apps.apiBaseUrl + 'empanelement_application_status';
    private apiUrlClaimedStatus = Apps.apiBaseUrl + 'update_claimedRequest_status';
    private apiUrlCheckClaimStatus = Apps.apiBaseUrl + 'get_claimedRequest_status';
    private apiUrlCreateFeedback = Apps.apiBaseUrl + 'create_feedback';
    
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

  
  inviteSubscriber(inviteSubscriber): Observable<any> {
    let requestData: any = [];
    // let x = sessionStorage.getItem("userdata");
    // console.log(JSON.parse(sessionStorage.getItem("userdata")).user_id);
    // console.log(JSON.parse(sessionStorage.getItem("userdata")).firstname +' '+JSON.parse(sessionStorage.getItem("userdata")).lastname);
    
    requestData = {};
    requestData = {                        
            user_id: inviteSubscriber.user_id,
            doctor_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,
            doctor_name: JSON.parse(sessionStorage.getItem("userdata")).firstname +' '+JSON.parse(sessionStorage.getItem("userdata")).lastname
    };    
    // console.log(requestData); 
    return this.http.post(this.apiUrlInviteSub, requestData);
  }

  getDoctorData(): Observable<any> {
    let requestData: any = [];
  
    requestData = {};
    requestData = {                        
            user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id    };    
    // console.log(requestData); 
    return this.http.post(this.apiUrlGetDoctorData, requestData);
  }

  /*updateAddFcmToken() {
    console.log("enter"); 
    let request: any = [];
    request = {};
    request = {
            user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,
            fcm_token: sessionStorage.getItem("fcm_token") 
    };    
    console.log(this.apiUrlUpdateUserFcmToken); 
    return this.http.post(this.apiUrlUpdateUserFcmToken, request); 
  }*/
  
  getEmpanelementStatus(): Observable<any> {
    let requestData: any = [];
  
    requestData = {};
    requestData = {                        
          doctor_id: JSON.parse(sessionStorage.getItem("userdata")).user_id    };    
    // console.log(requestData); 
    return this.http.post(this.apiUrlGetEmpanelmentStatus, requestData);
  }

  doctorAgree(agreeForm): Observable<any> {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

var todayDate = yyyy+'-'+mm+'-'+dd;
    let requestData: any = [];
  
    requestData = {};
    requestData = { 
          status: "1",
          subscriber_id : JSON.parse(sessionStorage.getItem("userdata")).user_id,                
          doctor_id: agreeForm.pin,
          requested_date: todayDate  };    
    // console.log(requestData); 
    return this.http.post(this.apiUrlClaimedStatus, requestData);
  }

  doctorDisAgree(): Observable<any> {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

var todayDate = yyyy+'-'+mm+'-'+dd;
    let requestData: any = [];
  
    requestData = {};
    requestData = { 
          status: "2",
          subscriber_id : JSON.parse(sessionStorage.getItem("userdata")).user_id,                
          doctor_id: JSON.parse(sessionStorage.getItem("userdata")).doctor_id,
          requested_date: todayDate  };    
    // console.log(requestData); 
    return this.http.post(this.apiUrlClaimedStatus, requestData);
  }

  getClaimStatus(): Observable<any> {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

var todayDate = yyyy+'-'+mm+'-'+dd;
    let requestData: any = [];
  
    requestData = {};
    requestData = { 
          doctor_id : JSON.parse(sessionStorage.getItem("userdata")).doctor_id,                
          subscriber_id: parseInt(JSON.parse(sessionStorage.getItem("userdata")).user_id),
          requested_date: todayDate 
         };    
   
    return this.http.post(this.apiUrlCheckClaimStatus, requestData);
  }

  subscriberFeedback(formData): Observable<any> {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

var todayDate = yyyy+'-'+mm+'-'+dd;
    let requestData = {};
    requestData = { 
      date: todayDate,
      name: JSON.parse(sessionStorage.getItem("userdata")).firstname,
      email_address: JSON.parse(sessionStorage.getItem("userdata")).email,
      contact_no: formData.subContact,
      subject: formData.subSubject,
      message: formData.subMessage,
      subscriber_id: parseInt(JSON.parse(sessionStorage.getItem("userdata")).user_id),
      user_type: JSON.parse(sessionStorage.getItem("userdata")).category_name 
         };    
    //  console.log(requestData);
    return this.http.post(this.apiUrlCreateFeedback, requestData);
  }

  doctorFeedback(formData): Observable<any> {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

var todayDate = yyyy+'-'+mm+'-'+dd;
    let requestData = {};
    requestData = { 
      date: todayDate,
      name: JSON.parse(sessionStorage.getItem("userdata")).firstname,
      email_address: JSON.parse(sessionStorage.getItem("userdata")).email,
      contact_no: formData.docContact,
      subject: formData.docSubject,
      message: formData.docMessage,
      doctor_id: parseInt(JSON.parse(sessionStorage.getItem("userdata")).user_id),
      user_type: JSON.parse(sessionStorage.getItem("userdata")).category_name
         };    
    
    return this.http.post(this.apiUrlCreateFeedback, requestData);
  }

  corporateFeedback(formData): Observable<any> {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var todayDate = yyyy+'-'+mm+'-'+dd;
    let requestData = {};
    requestData = { 
      date: todayDate,
      name: JSON.parse(sessionStorage.getItem("userdata")).firstname,
      email_address: JSON.parse(sessionStorage.getItem("userdata")).email,
      contact_no: formData.corpContact,
      subject: formData.corpSubject,
      message: formData.corpMessage,
      corporate_id: parseInt(JSON.parse(sessionStorage.getItem("userdata")).user_id),
      user_type: "corporate"
         };    
    //  console.log(requestData);
    return this.http.post(this.apiUrlCreateFeedback, requestData);
  }

  
  addPayment() {

     
  let pHeaders = new HttpHeaders({ 
    'Content-Type': 'application/json; charset=utf-8 ',
    'Access-Control-Allow-Origin': '*'
  });
  let pOptions = { headers: pHeaders };
    console.log("Payment Enter");
    let MerchantKey = "FpcaUHu56A";
    let MerchantCode = "M18173";
    let RefNo = "A0001";
    let Amount = "1.00";
    let Currency = "MYR";
    let concatValue =  `${MerchantKey + MerchantCode + RefNo + Amount.split('.').join("") + Currency}`;
     console.log(concatValue);
     let shavalue = sha256(concatValue);
     console.log(shavalue);

     let requestData = {};
    requestData = { 
      MerchantCode: MerchantCode, 
      PaymentId: '',
      RefNo: RefNo,      
      Amount: Amount,
      Currency: Currency,
      ProdDesc: "test",
      UserName: "test1",
      UserEmail : "test@gmail.com",
      UserContact: "9949633109",
      Remark: "test",
      Lang: "ISO-8859-1",
      SignatureType: "SHA256",
      Signature: shavalue,
      ResponseURL: '/empanelment-form', 
      BackendURL: Apps.apiBaseUrl + 'payment'
     };    
     console.log(requestData);
     return this.http.post('https://payment.ipay88.com.my/epayment/entry.asp', requestData, pOptions);
  }

}
