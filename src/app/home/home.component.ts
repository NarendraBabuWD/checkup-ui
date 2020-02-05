import { Component, OnInit, ViewChild  } from '@angular/core';
import { HttpService } from '../services/http.service';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import appConstants from '../config/app.constants'
import { AuthService } from "../auth.service";
import { DataService } from "../services/data.service";
import { ClaimService } from "../services/claim.service";
// import { MessagingService } from "../messaging.service";
import { InviteSubscriberService } from "../services/inviteSuscriber.service";
import { UtilService } from '../services/util.service';
import { sha256 } from 'js-sha256';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public doctorRequest: FormGroup;
  @ViewChild('alertModal', {static: false}) alertModal: ModalDirective;
    message;
    isModalShown = false;
    showModal: boolean;
    pincheck = false;
    showSubModal: boolean;
    patientList: any[] = [];
  constructor(private httpService: HttpService, dialogService: DialogService,
              private data: DataService, private utilService: UtilService,
              private inviteSubscriberService: InviteSubscriberService, 
              private formBuilder: FormBuilder,
              private claimService: ClaimService, 
              // private msgService: MessagingService, 
              private router: Router, public auth: AuthService,
              private toastrService: ToastrService) { 
                
              }
  medicalSummaryInputForm: FormGroup;
  subscriberProfileRes;
  ngOnInit() {
    // this.restrictDoctor();
    this.showSubModal = false;
    this.getClaimStatus();
    this.getLoginDrpatInfo();

    // this.msgService.getPermission();
    // this.msgService.receiveMessage();
    // this.message = this.msgService.currentMessage;
    // this.inviteSubscriberService.updateUserFcmToken();
    this.medicalSummaryInputForm = this.formBuilder.group({
      subscriber_id: ['', [Validators.required]]
    });
    this.doctorRequest = this.formBuilder.group({
      pin: ['', [Validators.required]]
  });
    if(JSON.parse(sessionStorage.getItem("userdata")).category_name == "Doctor")
  {
    this.restrictDoctor();
    }
    
    
    //======== after user is logged in if subscriber get Doctor id.
    /*if (this.auth.isSubscriber() && !this.auth.getDoctorId()) {
      this.getUserProfile().subscribe((resp) => {
        const subscriberProfileRes = resp;
        if (subscriberProfileRes.status) {
          const { doctor_id } = subscriberProfileRes.data[0];
          const userData = JSON.parse(this.auth.getLoginDetails());
          userData["doctor_id"] = parseInt(doctor_id);
          this.auth.setLoginDetails(userData);
        }
      });
    }*/
    /*setTimeout(function(){
      console.log(JSON.parse(sessionStorage.getItem("userdata")).user_id);
      console.log(sessionStorage.getItem("fcm_token"));
    },1500);*/ 
 
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.medicalSummaryInputForm.controls; }

  getValidSubStatus(subscriber_id){
    if(this.patientList.length > 0){
      for (let i = 0; i < this.patientList.length; i++) {
        if(this.patientList[i].user_id == subscriber_id){
          return 3; // Successful match
        }
      }
      return 2; // No successful match
    } else {
      return 1; // No subsribers
    }
  }
  submit() {
    var res = this.getValidSubStatus(this.medicalSummaryInputForm.value.subscriber_id);
  
    if(res == 1){
      let message = 'No Subscriber is available under you';
       this.toastrService.success(message);
    } else if(res == 2){
      let message = 'You don\'t have access to data of this user' ;
      this.toastrService.success(message);
    } else if(res == 3){
      this.data.setSubscriberId(this.medicalSummaryInputForm.value.subscriber_id);
      this.router.navigate([appConstants.routingList.DOCTOR_MEDICAL_SUMMARY_COMPONENT]);
 
    }else{
      let message = 'Something Went Wrong';
      this.toastrService.success(message);
    }
    
    // this.data.setSubscriberId(this.medicalSummaryInputForm.value.subscriber_id);
    // this.router.navigate([appConstants.routingList.DOCTOR_MEDICAL_SUMMARY_COMPONENT]);
 
  }

  getUserProfile() {
    return this.httpService.commonPost(appConstants.apiBaseUrl + 'get_subscriber_details', { user_id: this.auth.getUserId() });
  }
getLoginDrpatInfo(){
  this.claimService.getClaimInfo().subscribe(patList => {
    // console.log(patList.data); 
    this.patientList = patList.data;
  });
}
  updateFcmTokn() {
    //  setTimeout(function(){
    //   console.log(sessionStorage.getItem("fcm_token"));
    // },1500);
    return this.httpService.commonPost(appConstants.apiBaseUrl + 'update_user_fcm_token', { 
      user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,
      fcm_token: sessionStorage.getItem("fcm_token") 
     });
   }

  /*getFcmToken(){
    console.log(JSON.parse(sessionStorage.getItem("userdata")).user_id);
    console.log(sessionStorage.getItem("fcm_token"));
  }*/

  restrictSubscriber(){
    this.addPayment();
    /*this.addPayment().subscribe((response) => {
      console.log(response);     
    });*/  
if(JSON.parse(sessionStorage.getItem("userdata")).doctor_id == ''){
  this.utilService.toastrInfo("Please Wait For Doctor's Invitation", "Subscriber");
} else if(JSON.parse(sessionStorage.getItem("userdata")).doctor_id != ''){
  this.getSubscriberDetails().subscribe((response) => {
    // console.log(response);
    if(response.data.length < 0){
      this.utilService.toastrInfo("Please Fill Profile Page", "Subscriber");
 } else {
  this.router.navigate(['/health-report']);
 }
  });
}
    // this.router.navigate(['/health-report']) 
  }

  getSubscriberDetails() {
    return this.httpService.commonPost(appConstants.apiBaseUrl + 'get_subscriber_details', { 
      user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id 
     });
  }

  addPayment() {
    console.log("Payment Enter");
    let MerchantKey = "FpcaUHu56A";
    let MerchantCode = "M18173";
    let RefNo = "A0003";
    let Amount = "1.00";
    let Currency = "MYR";
    let concatValue =  `${MerchantKey + MerchantCode + RefNo + Amount.split('.').join("") + Currency}`;
     console.log(concatValue);
     let shavalue = sha256(concatValue);
     console.log(shavalue);
    return this.httpService.commonPost('https://payment.ipay88.com.my/epayment/entry.asp', { 
      MerchantCode: MerchantCode, 
      PaymentId: 1,
      RefNo: RefNo,
      Currency: Currency,
      Amount: Amount,
      ProdDesc: "test",
      UserName: "test1",
      UserEmail : "test@gmail.com",
      UserContact: "9949633109",
      Remark: "test",
      Lang: "ISO-8859-1-English",
      SignatureType: "SHA256",
      Signature: shavalue,
      ResponseURL: appConstants.apiBaseUrl + 'payment', 
      BackendURL: appConstants.apiBaseUrl + 'payment'

     });
  }


  restrictDoctor(){
    this.inviteSubscriberService.getDoctorData().subscribe(disList => {
      
      if(disList['data'].length > 0){
        // this.router.navigate(['/doctor/profile']);
        // this.checkEmpanelment();
      } else{
        this.router.navigate(['/doctor/profile']);
      }
    });

    this.updateFcmTokn().subscribe((response) => {
      // const subscriberProfileRes = resp;
    });

    /*this.inviteSubscriberService.getEmpanelementStatus().subscribe(response => {
    
     if(response['data'].length > 0 && response['data'][0].status == '1'){
      this.router.navigate(['claim-submission']);
     }else if(response['data'].length > 0 && response['data'][0].status == '0'){
      let message = 'Your Empanelment is Pending';
      this.toastrService.success(message); 
     } else if(response['data'].length > 0 && response['data'][0].status == '2'){
      let message = 'Your Empanelment is Rejected';
      this.toastrService.success(message); 
     }else{
      let message = 'kindly Add Empanelment';
      this.toastrService.success(message); 
     }
  
    });*/
    // this.router.navigate(['']);
  }

  checkEmpanelment(){
    this.inviteSubscriberService.getEmpanelementStatus().subscribe(response => {
    
      if(response['data'].length > 0 && response['data'][0].status == '1'){
       this.router.navigate(['claim-submission']);
      }else if(response['data'].length > 0 && response['data'][0].status == '0'){
       let message = 'Your Empanelment is Pending';
       this.toastrService.success(message); 
      } else if(response['data'].length > 0 && response['data'][0].status == '2'){
       let message = 'Your Empanelment is Rejected';
       this.toastrService.success(message); 
      }else{
       let message = 'kindly Add Empanelment';
       this.toastrService.success(message); 
       this.router.navigate(['empanelment-form']);
      }
   
     });
  }

  medicalSummaryInputFormModel(){
    this.inviteSubscriberService.getEmpanelementStatus().subscribe(response => {
    
      if(response['data'].length > 0 && response['data'][0].status == '1'){
      this.showSubModel();
      }else if(response['data'].length > 0 && response['data'][0].status == '0'){
       let message = 'Your Empanelment is Pending';
       this.toastrService.success(message); 
      } else if(response['data'].length > 0 && response['data'][0].status == '2'){
       let message = 'Your Empanelment is Rejected';
       this.toastrService.success(message); 
      }else{
       let message = 'kindly Add Empanelment';
       this.toastrService.success(message); 
       this.router.navigate(['empanelment-form']);
      }
   
     });
  }

  show()
{
  this.showModal = true; // Show-Hide Modal Check
}
//Bootstrap Modal Close event
hide()
{
  this.showModal = false;
}

showSubModel()
{
  this.showSubModal = true; // Show-Hide Modal Check
}
subModalClose(){
  this.showSubModal = false; 
}
onSubmit( model: FormGroup ) {
  this.inviteSubscriberService.doctorAgree( model.value ).subscribe( response => {
      let message = 'Doctor Requested Successfully';
      this.toastrService.success(message);                  
  },
      error => {
        //   this.alertNotSuccess();
          
      } );

} 

doctorDisAgree() {
  this.inviteSubscriberService.doctorDisAgree().subscribe( response => {
      let message = 'Doctor Requested Disagreed';
      this.toastrService.success(message);                  
  },
      error => {
        //   this.alertNotSuccess();
          
      } );

} 

getClaimStatus() {
  this.inviteSubscriberService.getClaimStatus().subscribe( status => {
     console.log(status['data'][0].status);  
     if(status['data'].length > 0 && status['data'][0].status == 0){
      this.show();
      this.isModalShown = true;
     }                
  },
      error => {
        //   this.alertNotSuccess();
          
      } );

} 

}
