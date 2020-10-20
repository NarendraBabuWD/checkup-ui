import { Component, OnInit, ViewChild  } from '@angular/core';
import { MessagingService } from "../messaging.service";
import { HttpService } from '../services/http.service';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import appConstants from '../config/app.constants';
import { AuthService } from "../auth.service";
import { DataService } from "../services/data.service";
import { ClaimService } from "../services/claim.service";
import * as _ from 'underscore';
import { InviteSubscriberService } from "../services/inviteSuscriber.service";
import { UtilService } from '../services/util.service';
import { sha256 } from 'js-sha256';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public doctorRequest: FormGroup;
  @ViewChild('alertModal', {static: false}) alertModal: ModalDirective;
    message;
    empStatus;
    isModalShown = false;
    showModal: boolean;
    pincheck: Boolean = false;
    pincheckBtn: Boolean = false;
    showSubModal: boolean;
    showHealthModal: boolean;
    patientList: any[] = [];
    profileFlag: Boolean = false;
    empanelmentFlag: Boolean = false; 
    subscriptionFlag: Boolean = false; 
    drInfoFlag: Boolean = false; 

    transactionId;
  constructor(private httpService: HttpService, dialogService: DialogService,
              private data: DataService, private utilService: UtilService,
              private inviteSubscriberService: InviteSubscriberService, 
              private formBuilder: FormBuilder,
              private claimService: ClaimService, 
              private msgService: MessagingService, 
              private router: Router, public auth: AuthService,
              private toastrService: ToastrService) { 
                
              }

  healthDataInputForm: FormGroup;
  medicalSummaryInputForm: FormGroup;
  subscriberProfileRes;

  ngOnInit() {
    sessionStorage.removeItem('healthDataBySub');
    this.showSubModal = false;
    this.showHealthModal = false;
    this.getMyAccount();
    this.getLoginDrpatInfo();
    this.msgService.getPermission();
    this.msgService.receiveMessage();
    this.message = this.msgService.currentMessage;
    
    // this.inviteSubscriberService.updateUserFcmToken();
    this.medicalSummaryInputForm = this.formBuilder.group({
      subscriber_id: ['', [Validators.required]]
    });

    this.healthDataInputForm = this.formBuilder.group({
      subscriberId: ['', [Validators.required]]
    });

    this.doctorRequest = this.formBuilder.group({
      pin: ['', [Validators.required]]
  });
    if(JSON.parse(sessionStorage.getItem("userdata")).category == 1)
  {
    this.getMyEmpanelment();
    // this.restrictDoctor('0');
    } else if(JSON.parse(sessionStorage.getItem("userdata")).category == 2){
        this.getMyCurrentSubscription();
        this.getClaimStatus();
    }
  
    
  }
  

  // convenience getter for easy access to form fields
  get f() { return this.medicalSummaryInputForm.controls; }
  get g() { return this.healthDataInputForm.controls; }

  getValidSubStatus(subscriber_id){
    if(this.patientList.length > 0){
      for (let i = 0; i < this.patientList.length; i++) {
        if(this.patientList[i].id == subscriber_id){
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
      this.router.navigate(['/doctor-medical-summary', this.medicalSummaryInputForm.value.subscriber_id]);
 
    }else{
      let message = 'Something Went Wrong';
      this.toastrService.success(message);
    }
    
  }


  submitHealthData(){
    console.log(this.healthDataInputForm.value);
    sessionStorage.setItem('healthDataBySub', this.healthDataInputForm.value.subscriberId);
    this.router.navigate(['/health-report']);   // Remove in pahse2
    // this.router.navigate(['/initial-report']);
  }

getLoginDrpatInfo(){
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getSubscriberList', { }).subscribe(patList => {
  
    this.patientList = patList.data;
  });
}

getMyAccount(){
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getMyAccount', { }).subscribe(response => {
    // console.log(response);
    if(response.data.dob != null  && response.data.dob != "null" && response.data.dob != ""){
         this.profileFlag = true;
    } else {
      this.profileFlag = false;
    }
  });
}

getMyEmpanelment(){
   this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getMyEmpanelment', { }).subscribe(empStatus => {
    //  console.log(empStatus.data.empanelment_status);
    if(empStatus.status == false){
      this.empStatus = false;
      this.goToEmpPage();
    } else{
      this.empStatus = empStatus.data.empanelment_status;

      if(this.empStatus == 'Reject'){
        let message = 'Your Empanelment Request was rejected. Please proceed to contact us for further details';
        // this.toastrService.success(message);
        this.empAlert(message);
       } else if(this.empStatus == 'Pending'){
        let message = 'Your Empanelment Request is currently being Reviewed';
        // this.toastrService.success(message);
        this.empAlert(message);

    }
    }
   });
 }

  /*updateFcmTokn() {
    // console.log(sessionStorage.getItem("fcm_token"));
      this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'updateDeviceToken', 
      { device_id: sessionStorage.getItem("fcm_token")}).subscribe(data => {
        // console.log(data);
      });
   }*/

   getMyCurrentSubscription(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getMyCurrentSubscription', { }).subscribe(response => {
      // console.log(response);
      if(_.isEmpty(response.data) || response.data == "No Subscription found."){
        // this.subscriptionFlag = true;
        this.getMyDoctorInfo();
      } else {
        this.subscriptionFlag = false;
        this.drInfoFlag = false;
      }
    });
  }

  getMyDoctorInfo(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getMyDoctorInfo', { }).subscribe(response => {
      console.log(response);
     if(response.data['dr_id'] == undefined){
        // this.subscriptionFlag = true;
        this.drInfoFlag = true;
      } else {
        this.drInfoFlag = false;
        this.subscriptionFlag = true;
      }
    });
  }

  /*restrictSubscriber(){
    
if(JSON.parse(sessionStorage.getItem("userdata")).doctor_id == ''){
  this.utilService.toastrInfo("Please Wait For Doctor's Invitation", "Subscriber");
} else if(JSON.parse(sessionStorage.getItem("userdata")).doctor_id != ''){
  this.getSubscriberDetails().subscribe((response) => {
    if(response.data.length < 0){
      this.utilService.toastrInfo("Please Fill Profile Page", "Subscriber");
 } else {
  this.router.navigate(['/health-report']);
 }
  });
}
  }*/
    

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
  

  /*checkEmpanelment(){
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
  }*/

  medicalSummaryInputFormModel(){
    this.showSubModel();
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

showHealthDataModel()
{
  this.showHealthModal = true; // Show-Hide Modal Check
}
healthDataModalClose(){
  this.showHealthModal = false; 
}

onSubmit( model: FormGroup ) {
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'doApprovalAction', {
          transaction_id: this.transactionId,
          status: "1"
     }).subscribe(response => {
      let message = 'Doctor Requested Successfully';
      this.toastrService.success(message);    
      this.hide();          
      this.subModalClose();    
  },
      error => {
        //   this.alertNotSuccess();
          
      } );

} 

doctorDisAgree() {
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'doApprovalAction', {
    transaction_id: this.transactionId,
    status: "2"
   }).subscribe(status => {
    let message = 'Doctor Requested Disagreed';
      this.toastrService.success(message);      
      this.hide();          
      this.subModalClose();             
  },
      error => {
        //   this.alertNotSuccess();
          
      } );

} 

getClaimStatus() {
  this.transactionId = '';
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getWaitingApprovalList', { }).subscribe(status => {
    //  console.log(status);  
     if(status['data'].length > 0){
      this.show();
      this.isModalShown = false;
      this.transactionId = status['data'][0].transaction_id; 
     }       
  },
      error => {
        //   this.alertNotSuccess();
          
      } );

} 


onKeyUpPinCheck(event){
  if(this.transactionId == event.target.value){
      this.pincheck = false;
      this.pincheckBtn = false;
  } else if(event.target.value == ''){
        this.pincheck = false;
        this.pincheckBtn = false;
  } else {
        this.pincheck = true;
        this.pincheckBtn = true;
  }

}

restrictDoctor(tile){
  console.log(this.profileFlag);
    if(this.profileFlag == true){
           if(this.empStatus == false){
            let message = "You don't have Empanelment";
            this.toastrService.success(message);
            this.router.navigate(['empanelment-form']);
           } else if(this.empStatus == 'Reject'){
            // let message = 'Your Empanelment is Rejected';
            // this.toastrService.success(message);
            let message = 'Your Empanelment Request was rejected. Please proceed to contact us for further details';
            this.empAlert(message);
           } else if(this.empStatus == 'Pending'){
            // let message = 'Your Empanelment is in Pending';
            // this.toastrService.success(message);
            let message = 'Your Empanelment Request is currently being Reviewed';
            this.empAlert(message);
           } else {
            switch (tile) {
              case '1':
                //  this.router.navigate(['health-report']);
                this.showHealthDataModel();
              break;
              case '2':      
                 this.medicalSummaryInputFormModel();
              break;
              case '3':      
                 this.router.navigate(['doctor-appointment']);
              break;
              case '4':      
                 this.router.navigate(['announcements']);
              break;
              case '5':      
                 this.router.navigate(['claim-submission']);
              break;
              case '6':      
                this.router.navigate(['claim-history']);
              break;
              
              
              default:
            }
           }
    } else {
      this.router.navigate(['doctor/profile']);
    }
}

restrictSubscriber(tile){
  // console.log(tile);
  // console.log(this.profileFlag);
  // console.log(this.subscriptionFlag);
    if(this.profileFlag == true){
           if(this.drInfoFlag == true){
            // let message = 'Your Subscription is Pending';
            let message = "Please wait for Doctor's Invitation";
            this.toastrService.success(message);
           } else if(this.subscriptionFlag == true){
                  this.goToSubscriptionAccountPage();
           }else {
            switch (tile) {
              case '1':
                 this.router.navigate(['health-report']);  // Remove in pahse2
                // this.router.navigate(['/initial-report']);
              break;
              case '2':      
                 this.router.navigate(['subscriber/medical-summary']);
              break;
              case '3':      
                 this.router.navigate(['health-data']);
              break;
              case '4':      
                 this.router.navigate(['subscriber-appointment']);
              break;
              case '5':      
                 this.router.navigate(['subscription-account']);
              break;
              case '6':      
                this.router.navigate(['whatsnew']);
              break;
              case '7':      
              this.router.navigate(['healthInfoBits']);
            break;
              default:
            }
           }
    } else {
      this.router.navigate(['subscriber/profile']);
    }
}


goToEmpPage(){
  swal.fire(
    'Please submit an empanelment form before proceeding'
  ).then(() => {
    this.router.navigate(["empanelment-form"]);
  });
}

empAlert(message){
  swal.fire(
    message
  )
}


goToSubscriptionAccountPage(){
  swal.fire(
    'Success',
    'Your Subscription is Pending',
    'success'
  ).then(() => {
    this.router.navigate(["subscription-account"]);
  });
}
}
