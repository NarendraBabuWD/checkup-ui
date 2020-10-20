import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import appConstants from '../config/app.constants';
import { Router } from '@angular/router';
import { DataService } from "../services/data.service";

@Component({
  selector: 'app-trimonthly-report',
  templateUrl: './trimonthly-report.component.html',
  styleUrls: ['./trimonthly-report.component.css']
})
export class TrimonthlyReportComponent implements OnInit {

  constructor(private data: DataService,
             private httpService: HttpService) { }


  triMonthlyObj;
  triMonthlyReportData: any[] = [];
  triMonthlyCvd: any[] = [];
  quaterValue;
  subscriptionValue;

  ngOnInit() {
    this.data.getTriMonthlyData.subscribe(data => this.triMonthlyObj = data );
    // console.log(this.triMonthlyObj);
    this.quaterValue = this.triMonthlyObj.quarter;
    this.subscriptionValue = this.triMonthlyObj.subscription_id;
    

    

    if(JSON.parse(sessionStorage.getItem("userdata")).category == 1)
    {
     
      this.getTargetYearlyReportBySub();
      } else if(JSON.parse(sessionStorage.getItem("userdata")).category == 2){
        this.getTargetYearlyReport();
      }
  }


  
  getTargetYearlyReport(){
    let resData = [];
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getTargetYearlyReport', { }).subscribe(res => {
    
      // console.log(res);
      resData.push(res);
      // console.log(this.triMonthlyObj);
      // console.log(resData);

       let userCvd = [];
        Object.values(resData).map(value => {
            // console.log(value.data[this.triMonthlyObj.subscription_id]);
            Object.values(value.data[this.triMonthlyObj.subscription_id]).map(item => {
                // console.log(item[this.triMonthlyObj.quarter]);
                this.triMonthlyReportData.push(item[this.triMonthlyObj.quarter]);
            })
            console.log(value.data_ascvd[this.triMonthlyObj.subscription_id]);
            console.log(value.data_ascvd[this.triMonthlyObj.subscription_id][this.triMonthlyObj.quarter]);
            console.log(this.triMonthlyObj.quarter);
            this.triMonthlyCvd.push(value.data_ascvd[this.triMonthlyObj.subscription_id][this.triMonthlyObj.quarter]);  
           
        })

        console.log(this.triMonthlyCvd);
// console.log(userCvd);

    /*console.log(this.triMonthlyReportData);
  
    Object.values(resData).map(value => {
    Object.values(value.data_ascvd[this.triMonthlyObj.subscription_id]).map(itemCvd => {
      console.log(itemCvd[this.triMonthlyObj.quarter]);
      this.triMonthlyCvd.push(itemCvd[this.triMonthlyObj.quarter]);
  })
    console.log(this.triMonthlyCvd);
      
})*/

/*for(this.subscriptionValue in res.data_ascvd){
  console.log(this.subscriptionValue);
  console.log(this.quaterValue);
  
  if(res.data.hasOwnProperty(this.subscriptionValue)){
      const element = res.data_ascvd[this.subscriptionValue];
      console.log(element);
      for(this.quaterValue in element){
          if(element.hasOwnProperty(this.quaterValue)){
            const element1 = element[this.quaterValue];
            console.log(element1);
            this.triMonthlyCvd.push(element1);
            for(const key2 in element1){
              if(element1.hasOwnProperty(key2)){
                const element2 = element1[key2];
              this.triMonthlyCvd.push(element2);
              }
             
          }
          }
      }
  }
  
}*/


    });

    
  }


  getTargetYearlyReportBySub(){
    let resData = [];
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getTargetYearlyReport', { sub_id: sessionStorage.getItem("healthDataBySub") }).subscribe(res => {
    
      // console.log(res);
      resData.push(res);
      // console.log(this.triMonthlyObj);
      // console.log(resData);

       let userCvd = [];
        Object.values(resData).map(value => {
            // console.log(value.data[this.triMonthlyObj.subscription_id]);
            Object.values(value.data[this.triMonthlyObj.subscription_id]).map(item => {
                // console.log(item[this.triMonthlyObj.quarter]);
                this.triMonthlyReportData.push(item[this.triMonthlyObj.quarter]);
            })
            console.log(value.data_ascvd[this.triMonthlyObj.subscription_id]);
            console.log(value.data_ascvd[this.triMonthlyObj.subscription_id][this.triMonthlyObj.quarter]);
            console.log(this.triMonthlyObj.quarter);
            this.triMonthlyCvd.push(value.data_ascvd[this.triMonthlyObj.subscription_id][this.triMonthlyObj.quarter]);  
           
        })

        console.log(this.triMonthlyCvd);
// console.log(userCvd);



    });

    
  }

}
