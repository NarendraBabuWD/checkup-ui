import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { AuthService } from '../auth.service';
import { DataService } from "../services/data.service";
import { MyHealthReportService } from '../services/my-health-report.service';
import { ClaimService } from "../services/claim.service";
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import appConstants from '../config/app.constants';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-health-report',
  templateUrl: './my-health-report.component.html',
  styleUrls: ['./my-health-report.component.css']
})
export class MyHealthReportComponent implements OnInit {
 constructor(private httpService: HttpService, private formBuilder: FormBuilder, 
             public auth: AuthService, private data : DataService,
             private healthReportService: MyHealthReportService,
             private toastrService: ToastrService, private router: Router,
             private claimService: ClaimService) { }
  httpdata;
  patientList: any[] = [];
  resData: any[] = [];
  respData: any[] = [];
  yearlyData: any[] = [];
  subIdList: any[] = [];
  user_id: string;
  isViewOnly = false;
  finalData;
  yearList = [];
  isQuarterlyReport = false;
  isInitialReport = false;
  isProgressReport = false;
  isYearlyReport = false;
  initialReportInputForm: FormGroup;
  quartelyReportInputForm: FormGroup;
  progressReportInputForm: FormGroup;
  yearlyReportInputForm: FormGroup;
  quarterList;
  isUpcomingBtn = false;
  isGenerateBtn = false;
  upComBtnDisabled = false;
  genBtnDisabled = false;
  quaterValue;
  getQuaterValue = [];

  // listYear = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
  
  ngOnInit() {
    // this.getLoginDrpatInfo();
    if (this.auth.isSubscriber()) {//====== if Subascriber Take user_id from session.=====
      this.user_id = JSON.parse(sessionStorage.getItem('userdata')).user_id;
      this.isViewOnly = true;
    } else if (this.auth.isDoctor()) {
      this.data.getSubscriberId.subscribe(subscriber_id => this.user_id = subscriber_id);
    }

    if(JSON.parse(sessionStorage.getItem("userdata")).category == 2){
      this.getUserSubscriptionQuarter();
      this.isUpcomingBtn = true;
      this.isGenerateBtn = false;
  } else if(JSON.parse(sessionStorage.getItem("userdata")).category == 1){
      this.isGenerateBtn = true;
      this.isUpcomingBtn = true;
      // this.getdrSideUserSubscriptionQuarter();
      this.getSubscriberInitialTarget();
      console.log(sessionStorage.getItem("healthDataBySub"));
    
}

  // initialReportForm: FormGroup;
  this.initialReportInputForm = this.formBuilder.group({
      subscriber_id: ['', [Validators.required]]
     });
    //====== set user_id by default if subscriber logged in  ====/
    let set_user_id = this.auth.isDoctor() ? '' : this.user_id;

     this.quartelyReportInputForm = this.formBuilder.group({
      user_id: [set_user_id, [Validators.required]],
      year: ['', [Validators.required]],
      quarter: ['', [Validators.required]]
     });

     this.yearlyReportInputForm = this.formBuilder.group({
      user_id: [set_user_id, [Validators.required]],
      year: ['', [Validators.required]]
     });

    // progressReportForm: FormGroup;
    this.progressReportInputForm = this.formBuilder.group({
      user_id: ['', [Validators.required]]
   });

     this.quarterList = [1,2,3,4];
     this.getYearList();
  }
  getLoginDrpatInfo(){
    this.claimService.getClaimInfo().subscribe(patList => {
      // console.log(patList.data); 
      this.patientList = patList.data;
    });
  }
   // convenience getter for easy access to form fields
   get f() { return this.initialReportInputForm.controls; }

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

   submit(){
    // this.data.setSubscriberId(this.initialReportInputForm.value.subscriber_id);
     //this.router.navigate([appConstants.routingList.MyHealthReportListComponent]);
    // this.healthReportService.loadInitialHealthReportData(this.initialReportInputForm.value.subscriber_id);
    // var res = this.getValidSubStatus(this.initialReportInputForm.value.subscriber_id);
    // setTimeout(()=>{
      // console.log(this.initialReportInputForm.value.subscriber_id);
      // this.healthReportService.user_id_emitter.emit(this.initialReportInputForm.value.subscriber_id);
      this.data.setSubscriberId(this.initialReportInputForm.value.subscriber_id);

    // }, 0);
      this.isQuarterlyReport = false;
      this.isInitialReport = true;
      this.isProgressReport = false;
    /*if(res == 1){
      let message = 'No Subscriber is available under you';
       this.toastrService.success(message);
    } else if(res == 2){
      let message = 'You don\'t have access to data of this user' ;
      this.toastrService.success(message);
    } else if(res == 3){
      this.data.setSubscriberId(this.initialReportInputForm.value.subscriber_id);

      setTimeout(()=>{
        this.healthReportService.user_id_emitter.emit(this.initialReportInputForm.value.subscriber_id);
      }, 0);
      this.isQuarterlyReport = false;
      this.isInitialReport = true;
      this.isProgressReport = false;
    }else{
      let message = 'Something Went Wrong';
      this.toastrService.success(message);
    }*/
   
    
   }

  getYearList() {
    let year = new Date().getFullYear();
    this.yearList = [];
    for (var i = 0; i < 1; i++) {
      this.yearList.push(year - i);
    }
  }

  subscriberInitialReport(){
    this.isQuarterlyReport = false;
    this.isInitialReport = true;
    this.isProgressReport = false;
    this.isYearlyReport = false;
    /*setTimeout(()=>{
      this.healthReportService.user_id_emitter.emit(this.user_id);
    }, 0);*/
  }

  subscriberYearlyReport(){
    this.isQuarterlyReport = false;
    this.isInitialReport = false;
    this.isProgressReport = false;
    this.isYearlyReport = true;
  }

  // convenience getter for easy access to form fields
  get qf() { return this.quartelyReportInputForm.controls; }
  quartelyReportInputSubmit(){
    var res = this.getValidSubStatus(this.quartelyReportInputForm.value.user_id);
    if(res == 1){
      let message = 'No Subscriber is available under you';
       this.toastrService.success(message);
    } else if(res == 2){
      let message = 'You don\'t have access to data of this user' ;
      this.toastrService.success(message);
    } else if(res == 3){
      this.data.setQuartelyReport(this.quartelyReportInputForm.value);
    setTimeout(()=>{
      this.healthReportService.user_id_emitter.emit(this.quartelyReportInputForm.value);
    }, 0);
    this.isQuarterlyReport = true;
    this.isInitialReport = false;
    this.isProgressReport = false;
    }else{
      let message = 'Something Went Wrong';
      this.toastrService.success(message);
    }    
  }

  yearlyReportInputSubmit(){
    var res = this.getValidSubStatus(this.yearlyReportInputForm.value.user_id);
    if(res == 1){
      let message = 'No Subscriber is available under you';
       this.toastrService.success(message);
    } else if(res == 2){
      let message = 'You don\'t have access to data of this user' ;
      this.toastrService.success(message);
    } else if(res == 3){
      this.data.setYearlyReport(this.yearlyReportInputForm.value);
      setTimeout(()=>{
        this.healthReportService.user_id_emitter.emit(this.yearlyReportInputForm.value);
      }, 0);
  
      this.isQuarterlyReport = false;
      this.isInitialReport = false;
      this.isProgressReport = false;
      this.isYearlyReport = true;
    }else{
      let message = 'Something Went Wrong';
      this.toastrService.success(message);
    }
  }

  // convenience getter for easy access to form fields
  get pf() { return this.progressReportInputForm.controls; }
  progressReportInputSubmit(){
    var res = this.getValidSubStatus(this.progressReportInputForm.value.user_id);
    if(res == 1){
      let message = 'No Subscriber is available under you';
       this.toastrService.success(message);
    } else if(res == 2){
      let message = 'You don\'t have access to data of this user' ;
      this.toastrService.success(message);
    } else if(res == 3){
      this.isQuarterlyReport = false;
    this.isInitialReport = false;
    this.isProgressReport = true;
    this.data.setSubscriberId(this.progressReportInputForm.value.user_id);
    setTimeout(()=>{
      this.healthReportService.user_id_emitter.emit(this.progressReportInputForm.value.user_id);
    }, 0);
    }else{
      let message = 'Something Went Wrong';
      this.toastrService.success(message);
    }    
  }

  subscriberProgressReport(){
    this.isQuarterlyReport = false;
    this.isInitialReport = false;
    this.isProgressReport = true;
    setTimeout(()=>{
      this.healthReportService.user_id_emitter.emit(this.user_id);
    }, 0);
  }
  ngOnDestroy(): void {
    
  }

  goToTriMonthlyReport(item){
    console.log(item);
    this.data.setTriMonthlyData(item);
    this.router.navigate(['trimonthly-report']);
  }
  
  goToYearlyReport(item){
    console.log(item);
    this.data.setYearlyData(item);
    this.router.navigate(['yearly-report']);
  }

  getUserSubscriptionQuarter(){
    
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getUserSubscriptionQuarter', { }).subscribe(res => {
    
      // console.log(res.data);
      
      if(res.data.length > 0){
        this.router.navigate(['health-report']);
         this.resData = res.data;
        /*this.resData = [
          
                {
                    "subscription_id": "1",
                    "subscription_period": "01/01/2020-31/12/2020",
                    "package_name": "Package A",
                    "quarter": 1,
                    "generated_date": "2020-05-07 13:13:59"
                },
                {
                    "subscription_id": "1",
                    "subscription_period": "01/01/2020-31/12/2020",
                    "package_name": "Package A",
                    "quarter": 2,
                    "generated_date": "2020-06-05 14:35:49"
                },
                {
                    "subscription_id": "1",
                    "subscription_period": "01/01/2020-31/12/2020",
                    "package_name": "Package A",
                    "quarter": 3,
                    "generated_date": "2020-06-08 02:05:28"
                },
                {
                    "subscription_id": "1",
                    "subscription_period": "01/01/2020-31/12/2020",
                    "package_name": "Package A",
                    "quarter": 4,
                    "generated_date": "2020-06-08 13:33:53"
                },
         {
                    "subscription_id": "2",
                    "subscription_period": "01/01/2020-31/12/2020",
                    "package_name": "Package A",
                    "quarter": 5,
                    "generated_date": "2020-05-07 13:13:59"
                },
                {
                    "subscription_id": "2",
                    "subscription_period": "01/01/2020-31/12/2020",
                    "package_name": "Package A",
                    "quarter": 6,
                    "generated_date": "2020-06-05 14:35:49"
                },
                {
                    "subscription_id": "2",
                    "subscription_period": "01/01/2020-31/12/2020",
                    "package_name": "Package A",
                    "quarter": 7,
                    "generated_date": "2020-06-08 02:05:28"
                },
                {
                  "subscription_id": "2",
                  "subscription_period": "01/01/2020-31/12/2020",
                  "package_name": "Package A",
                  "quarter": 8,
                  "generated_date": "2020-07-08 02:05:28"
              },
           
        ];*/

        for(let i = 0; i < this.resData.length; i++){
          
          if(this.resData[i].generated_date != ""){
            this.respData.push(this.resData[i]);
          }
        }
        
        if(this.respData.length == 0){
          this.router.navigate(['initial-report']);
        }
         for(let l = 0; l < this.resData.length; l++){
          //  console.log(this.resData[l].subscription_id);
          if (this.subIdList.includes(this.resData[l].subscription_id) === false) this.subIdList.push(this.resData[l].subscription_id);
        }
        console.log(this.resData);

        console.log(this.subIdList);
        if(this.respData.length == (this.subIdList.length * 4)){
          this.upComBtnDisabled = true;
        } else {
          this.upComBtnDisabled = false;
        }


            for(let i = 0; i < this.subIdList.length; i++){
              var itemCount = 0;
              for(let j = 0; j < this.resData.length; j++){ 
                if(this.subIdList[i] == this.resData[j].subscription_id && this.resData[j].generated_date != ""){
                  itemCount += 1;
                  if(itemCount == 4){
                    // this.upComBtnDisabled = false;
                    this.yearlyData.push(this.resData[j]);
                  } 
                  
                }
            }
        }

        // console.log(itemCount);
        // console.log(this.yearlyData);

        

        // for(let k = 0; k < this.subIdList.length; k++){
             
        // }

        
      } else{
        this.router.navigate(['initial-report']);
      }
         
    });

    
  }


  
  getdrSideUserSubscriptionQuarter(){
    
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getUserSubscriptionQuarter', { sub_id: sessionStorage.getItem("healthDataBySub") }).subscribe(res => {
    
      // console.log(res.data);
      
      if(res.data.length > 0){
        this.router.navigate(['health-report']);
         this.resData = res.data;
     

         for(let i = 0; i < this.resData.length; i++){
          
          if(this.resData[i].generated_date != ""){
            this.respData.push(this.resData[i]);
          }
        }

         for(let l = 0; l < this.resData.length; l++){
          //  console.log(this.resData[l].subscription_id);
          if (this.subIdList.includes(this.resData[l].subscription_id) === false) this.subIdList.push(this.resData[l].subscription_id);
        }
        // console.log(this.respData);

       
       
            for(let i = 0; i < this.subIdList.length; i++){
              var itemCount = 0;
              for(let j = 0; j < this.resData.length; j++){ 
                if(this.subIdList[i] == this.resData[j].subscription_id && this.resData[j].generated_date != ""){
                  itemCount += 1;
                  if(itemCount == 4){
                    this.yearlyData.push(this.resData[j]);
                  } 
                  
                }
            }
        }
         this.getTargetYearlyReport();
        // console.log(itemCount);
        // console.log(this.yearlyData);

        
      } else{
        this.router.navigate(['initial-report']);
      }
         
    });

    
  }

  getTargetYearlyReport(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getTargetYearlyReport', { sub_id: sessionStorage.getItem("healthDataBySub")}).subscribe(response => {
   
      // console.log(response);
      
      for(const key in response.data){
        // console.log(key);
        
       if(response.data.hasOwnProperty(key)){
            const element = response.data[key];
            // console.log(element);
            // console.log(element[Object.keys(element)[0]]);
            Object.keys(element[Object.keys(element)[0]]).map(item => {
              // console.log(item);
              this.getQuaterValue.push(item);
            })
            //  console.log(this.getQuaterValue);
            //  console.log(this.respData);
            //  this.getSubscriberInitialTarget();
            
          //  console.log(this.subIdList);
           if(this.respData.length == (this.subIdList.length * 4)){
            this.upComBtnDisabled = true;
            this.genBtnDisabled = true;
          } else {
            if(this.getQuaterValue.length == this.respData.length){
              console.log("Equal");
              this.genBtnDisabled = true;
           } else {
              console.log("Not Equal");
              this.genBtnDisabled = false;
              this.upComBtnDisabled = false;
           }
          }
        }
      }
    });
   }

  
  getSubscriberInitialTarget(){
    
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getSubscriberInitialTarget', { sub_id: sessionStorage.getItem("healthDataBySub") }).subscribe(res => {
    
      // console.log(res.data);
      
      if(res.data.length > 0){
        this.getdrSideUserSubscriptionQuarter();
      } else{
        this.router.navigate(['initial-report']);
      }
         
    });

    
  }

  upcomingBtn(){
    if(JSON.parse(sessionStorage.getItem("userdata")).category == 2){
      // this.getUserSubscriptionQuarter();
      // this.isUpcomingBtn = true;
      // this.isGenerateBtn = false;
      this.router.navigate(['initial-report']);
  } else if(JSON.parse(sessionStorage.getItem("userdata")).category == 1){
      this.router.navigate(['upcoming-report']);
      // this.isGenerateBtn = true;
      // this.isUpcomingBtn = true;
      // this.getdrSideUserSubscriptionQuarter();
      // this.getSubscriberInitialTarget();
      // console.log(sessionStorage.getItem("healthDataBySub"));
    
}
  }

}
