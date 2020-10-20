import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { AuthService } from '../auth.service';
import { DataService } from "../services/data.service";
import * as _ from 'underscore';
import { UtilService } from '../services/util.service';
import { MyHealthReportService } from '../services/my-health-report.service';
import appConstants from '../config/app.constants';
import { Router, ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-upcoming-report',
  templateUrl: './upcoming-report.component.html',
  styleUrls: ['./upcoming-report.component.css']
})
export class UpcomingReportComponent implements OnInit {

  patchReportData = [];
  pageTitle = "";
  btnTitle = '';
  quaterValue;
  getQuaterValue = [];
  initial = {};
  target = {};
  alerttDetails: boolean = false;


  constructor(private auth: AuthService, private data: DataService,
    private httpService: HttpService, private utilService: UtilService,
    private healthReportService: MyHealthReportService, private router: Router) { }

  ngOnInit() {
    // this.getSubscriberInitialTarget();
    
    this.getValidQuaters();
    
  }

  openAlertModal(){
    this.alerttDetails = true;
  }

  closeAlertModal(){
    this.alerttDetails = false;
  }
  
  getSubscriberInitialTarget(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getSubscriberInitialTarget', { sub_id: sessionStorage.getItem("healthDataBySub")}).subscribe(resp => {
     
      console.log(resp.data);
      this.patchReportData = resp.data;
      // console.log(this.patchReportData);

    });
  }

     getValidQuaters(){
      this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getUserSubscriptionQuarter', { sub_id: sessionStorage.getItem("healthDataBySub")}).subscribe(res => {
     
        // console.log(resp.data);
        let respData = [];
        for(let i = 0; i < res.data.length; i++){
          
          if(res.data[i].generated_date != ""){
            respData.push(res.data[i]);
          }
        }
        // console.log(respData);
        this.quaterValue = respData.length;
      
        this.getTargetYearlyReport();
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
               console.log(this.getQuaterValue);
               console.log(this.quaterValue);
               this.getSubscriberInitialTarget();
               if(this.getQuaterValue.length == this.quaterValue){
                console.log("Equal");
                this.pageTitle = "Upcoming Report";
                this.btnTitle = "Create";
             } else {
                console.log("Not Equal");
                this.pageTitle = "Initial Report";
                this.btnTitle = "Update";
             }
          }
        }
      });
     }

   
  onClickData(){
    // let initial = {};
    // let target = {};

               console.log(this.getQuaterValue);
               console.log(this.quaterValue);
              console.log(this.patchReportData);
              

               for(let i = 0; i < this.patchReportData.length; i++){
                if(this.patchReportData[i].target != ""){
                  this.initial[this.patchReportData[i].category_id] = this.patchReportData[i].initial;
                  this.target[this.patchReportData[i].category_id] = this.patchReportData[i].target;
                } else{
                    let message = "Please Provide Valid";
                    return this.utilService.toastrError(this.patchReportData[i].category_name, message);
                }
                  
      }

              // console.log(initial);
              // console.log(target);

               if(this.getQuaterValue.length == this.quaterValue){
                  console.log("Equated");
                  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'createNewTarget', 
                            { sub_id: sessionStorage.getItem("healthDataBySub"),
                              target: this.target
                            }
                            ).subscribe(resp => {
                                this.utilService.toastrSuccess("Updated Successfully", "Upcoming Report");
                                this.router.navigate(['home']);
                            }, (err) => {
                              console.log(err);
                              this.utilService.toastrError("Updated Failed", "Upcoming Report");
                            });
               } else {
                  console.log("Not Equal");
                  // this.openAlertModal();
                  this.alerttDetails = true;
                 /* this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'addUpdateInitialReport', 
                  { sub_id: sessionStorage.getItem("healthDataBySub"),
                    initial: initial,
                    target: target}
                  ).subscribe(resp => {
                      this.utilService.toastrSuccess("Updated Successfully", "Initial Report");
                      this.router.navigate(['home']);
                  }, (err) => {
                    console.log(err);
                    this.utilService.toastrError("Updated Failed", "Initial Report");
                  });*/
               }
   /* console.log(this.patchReportData);
    // console.log(this.user_id);

    for(let i = 0; i < this.patchReportData.length; i++){
          if(this.patchReportData[i].target != ""){
            target[this.patchReportData[i].category_id] = this.patchReportData[i].target;
          } else{
              let message = "Please Provide Valid";
              return this.utilService.toastrError(this.patchReportData[i].category_name, message);
          }
            
}

console.log(target);


 console.log(this.getQuaterValue);
               console.log(this.quaterValue);

    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'createNewTarget', 
    { sub_id: sessionStorage.getItem("healthDataBySub"),
      target: target
     }
    ).subscribe(resp => {
        this.utilService.toastrSuccess("Updated Successfully", "Upcoming Report");
        this.router.navigate(['home']);
    }, (err) => {
      console.log(err);
      this.utilService.toastrError("Updated Failed", "Upcoming Report");
    });*/
      
 }

 addUpdateInitialReport(){
  this.alerttDetails = false;
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'addUpdateInitialReport', 
  { sub_id: sessionStorage.getItem("healthDataBySub"),
    initial: this.initial,
    target: this.target}
  ).subscribe(resp => {
      this.utilService.toastrSuccess("Updated Successfully", "Initial Report");
      this.router.navigate(['home']);
  }, (err) => {
    console.log(err);
    this.utilService.toastrError("Updated Failed", "Initial Report");
  });
 }
}
