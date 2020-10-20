
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
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {

  
  generateReportData = [];
  arrayF = [];
  alerttDetails: boolean = false;
  initial = {};
  target = {};
  achieved = {};
  private healthDataConfig = [
    {category: "body_weight", title: "Body Weight"},
    {category: "bp", title: ""},
    {category: "heart_rate", title: "Heart Rate"},
    {category: "steps", title: "Average Steps taken"},
    {category: "bmi", title: "Body Mass Index (BMI)"}
];

  constructor(private auth: AuthService, private data: DataService,
    private httpService: HttpService, private utilService: UtilService,
    private healthReportService: MyHealthReportService, private router: Router) { }

  ngOnInit() {
    
    
    this.getLatestDeviceData();
  }

  openAlertModal(){
    this.alerttDetails = true;
  }

  closeAlertModal(){
    this.alerttDetails = false;
  }

  
  getLatestDeviceData(){
    // let arrayF = [];
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getLatestDeviceData', { sub_id: sessionStorage.getItem("healthDataBySub") }).subscribe(resp => {
        // console.log(resp);
        
      //  console.log(this.healthDataConfig);
        for(let j = 0; j <= this.healthDataConfig.length - 1; j++){
            for (let [key, value] of Object.entries(resp.data)) {
                // console.log(key, value);
                if(this.healthDataConfig[j].category == key){
                    if(this.healthDataConfig[j].category == 'bp'){
                         let bpValue = resp.data.bp;
                         
                         let res = bpValue.split("/");
                         let sysVal = res[0].trim();
                         let diaVal = res[1].trim();
                         this.arrayF.push({ title: "Systolic", values: sysVal},
                                      { title: "Diastolic", values: diaVal});
                    }else{
                        this.arrayF.push({title: this.healthDataConfig[j].title, values: value});
                    }
                }

            }

        }
        // console.log(arrayF);
        this.getSubscriberInitialTarget();
    });
    // this.getSubscriberInitialTarget();
}

  getSubscriberInitialTarget(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getSubscriberInitialTarget', { sub_id: sessionStorage.getItem("healthDataBySub")}).subscribe(resp => {
     
      // console.log(resp.data);
      // this.generateReportData = resp.data;
      // console.log(this.generateReportData);

     /* for(let j = 0; j < this.generateReportData.length; j++){
        this.generateReportData[j]['achieved'] = "";
      }*/
      console.log(this.arrayF);
     

      for(let k = 0; k < resp.data.length; k++){
        for(let i = 0; i < this.arrayF.length; i++){
          if(resp.data[k].category_name == this.arrayF[i].title){
              console.log(this.arrayF[i].values);
              
                this.generateReportData.push({
                    category_id: resp.data[k].category_id,
                    category_name: this.arrayF[i].title,
                    initial: resp.data[k].initial,
                    target: resp.data[k].target,
                    achieved: this.arrayF[i].values === null ? "0" : this.arrayF[i].values
                    // achieved: this.arrayF[i].values
                });
                break;
          } else if((resp.data[k].category_name != this.arrayF[i].title) && (i == this.arrayF.length - 1)){
            this.generateReportData.push({
                category_id : resp.data[k].category_id,
                category_name : resp.data[k].category_name,
                initial: resp.data[k].initial,
                target: resp.data[k].target,
                achieved : '0'
            })
        }
    }
}
console.log(this.generateReportData);

for(let l=0; l < this.generateReportData.length; l++){
  if(this.generateReportData[l].category_name == "Heart Rate"){
     this.generateReportData[l].achieved = "-";
  } 
  if(this.generateReportData[l].category_name == "Systolic"){
    this.generateReportData[l].achieved = "-";
 }
 if(this.generateReportData[l].category_name == "Diastolic"){
  this.generateReportData[l].achieved = "-";
}
if(this.generateReportData[l].category_name == "Average Steps taken"){
  this.generateReportData[l].achieved = "-";
}
}
    });
  }


  onClickData(){
    
    console.log(this.generateReportData);
    // console.log(this.user_id);

    for(let i = 0; i < this.generateReportData.length; i++){
          if(this.generateReportData[i].initial != "" && this.generateReportData[i].target != "" && this.generateReportData[i].achieved != ""){
            this.initial[this.generateReportData[i].category_id] = this.generateReportData[i].initial;
            this.target[this.generateReportData[i].category_id] = this.generateReportData[i].target;
            this.achieved[this.generateReportData[i].category_id] = this.generateReportData[i].achieved;
          } else{
              let message = "Please Provide Valid";
              return this.utilService.toastrError(this.generateReportData[i].category_name, message);
          }
        
          
}
// console.log(this.user_id);
// console.log(initial);
// console.log(target);
// console.log(achieved);
this.alerttDetails = true;
    // this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'addUpdateInitialReport', 
    // { sub_id: sessionStorage.getItem("healthDataBySub"),
    //   initial: initial,
    //   target: target, 
    //   results: achieved }
    // ).subscribe(resp => {
    //     this.utilService.toastrSuccess("Updated Successfully", "Generate Report");
    //     this.router.navigate(['home']);
    // }, (err) => {
    //   console.log(err);
    //   this.utilService.toastrError("Updated Failed", "Generate Report");
    // });
      
 }

 addUpdateInitialReport(){
  this.alerttDetails = false;
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'addUpdateInitialReport', 
  { sub_id: sessionStorage.getItem("healthDataBySub"),
    initial: this.initial,
    target: this.target, 
    results: this.achieved }
  ).subscribe(resp => {
      this.utilService.toastrSuccess("Updated Successfully", "Generate Report");
      this.router.navigate(['home']);
  }, (err) => {
    console.log(err);
    this.utilService.toastrError("Updated Failed", "Generate Report");
  });
 }
}



