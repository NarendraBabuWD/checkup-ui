import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { AuthService } from '../auth.service';
import { DataService } from "../services/data.service";
import * as _ from 'underscore';
import { UtilService } from '../services/util.service';
import appConstants from '../config/app.constants';
import { MyHealthReportService } from '../services/my-health-report.service';
import { identifierModuleUrl } from '../../../node_modules/@angular/compiler';

@Component({
  selector: 'app-yearly-report',
  templateUrl: './yearly-report.component.html',
  styleUrls: ['./yearly-report.component.css']
})
export class YearlyReportComponent implements OnInit {

  constructor(private httpService: HttpService, private formBuilder: FormBuilder, private auth: AuthService,
    private data: DataService, private utilService: UtilService, private healthReportService: MyHealthReportService,
    ) { }

    yearlyInput;
    yearlyq1Data = [];
    yearlyq2Data = [];
    yearlyq3Data = [];
    yearlyq4Data = [];
    user_id: string;
    yearlyReportForm: FormGroup;// ====== intailze Form Group
    empFormObj = {};
    userData;
    healthReportServiceSubscribe;
    yearlyReportConfigData;
    yearlyAllData = [];
    filteredData = [];
    finalArr = [];
    subRes = {};


  yearlyObj;
  yearlyReportData: any[] = [];
  yearlyCvd: any[] = [];
  yearValue;
  subscriptionValue;

    
  ngOnInit() {
  
    
    this.data.getYearlyReport.subscribe(yearlyInput => this.yearlyInput = yearlyInput);
    // console.log(this.yearlyInput);
    /*if (JSON.parse(sessionStorage.getItem("userdata")).category == 2) {//====== if Subascriber Take user from session.=====
      // this.user_id = JSON.parse(sessionStorage.getItem('userdata')).user_id;
      // this.getTargetYearlyReportBySubscriber();
    }*/

    this.data.getProfileData.subscribe(userDetails => this.userData = userDetails );
    this.data.getYearlyData .subscribe(data => this.yearlyObj = data );
    console.log(this.yearlyObj);
    this.yearValue = this.yearlyObj.subscription_id;

    if(JSON.parse(sessionStorage.getItem("userdata")).category == 1)
    {
     
      this.getTargetYearlyReportBySubId();
      } else if(JSON.parse(sessionStorage.getItem("userdata")).category == 2){
        this.getTargetYearlyReportBySubscriber();
      }

    this.yearlyReportForm = this.formBuilder.group(this.empFormObj);
    this.healthReportServiceSubscribe = this.healthReportService.user_id_emitter.subscribe((e) => {
      if (this.auth.isDoctor()) {
        this.user_id = e.user_id; //==== any one is fine... below one
        // this.data.getSubscriberId.subscribe(subscriber_id => this.user_id = subscriber_id);
      }
    });

    /*this.yearlyQ1Report().subscribe((resp) => {
      this.yearlyq1Data = resp.data;
      // console.log( this.yearlyq1Data);
    });
    this.yearlyQ2Report().subscribe((resp) => {
      this.yearlyq2Data = resp.data;
      // console.log( this.yearlyq2Data);
    });
    this.yearlyQ3Report().subscribe((resp) => {
      this.yearlyq3Data = resp.data;
      // console.log( this.yearlyq3Data);
    });
    this.yearlyQ4Report().subscribe((resp) => {
      this.yearlyq4Data = resp.data;
      // console.log( this.yearlyq4Data);
    });*/
    this.yearlyAllData = [];
    setTimeout(()=>{
    // this.yearlyAllData = [...this.yearlyq1Data, ...this.yearlyq2Data, ...this.yearlyq3Data, ...this.yearlyq4Data]; 
    // console.log(this.yearlyAllData);


    this.finalArr = [];
    this.yearlyq3Data.forEach((info)=>{
          for(const key in info){
                if(info.hasOwnProperty(key)){
                    if(key == 'vital'){
                        let tempObj = {};
                        tempObj['vital'] = info.vital;
                        tempObj['quarter' +info.quarter] = info.performance;
                        this.finalArr.push(tempObj); 
                    }
                }
          }
    })

    
     
     for(let {vital,performance} of this.yearlyq3Data){
        let indVal = this.finalArr.findIndex(x => x.vital == vital);
        // Q1
        if(this.yearlyq1Data.length > 0){
          let obj1 = this.yearlyq1Data.find(x => x.vital == vital);
          this.finalArr[indVal]['quarter' +obj1.quarter] = obj1.performance === null ? null : parseFloat(obj1.performance).toFixed(2);
  
        }
       
        // Q2
        if(this.yearlyq2Data.length > 0){
        let obj2 = this.yearlyq2Data.find(x => x.vital == vital);
        this.finalArr[indVal]['quarter' +obj2.quarter] = obj2.performance === null ? null : parseFloat(obj2.performance).toFixed(2);
        }
        // Q3
        if(this.yearlyq3Data.length > 0){
        let obj3 = this.yearlyq3Data.find(x => x.vital == vital);
        this.finalArr[indVal]['quarter' +obj3.quarter] = obj3.performance === null ? null : parseFloat(obj3.performance).toFixed(2);  
        }
        // Q4
        if(this.yearlyq4Data.length > 0){
     let obj4 = this.yearlyq4Data.find(x => x.vital == vital);
     this.finalArr[indVal]['quarter' +obj4.quarter] = obj4.performance === null ? null : parseFloat(obj4.performance).toFixed(2);
      }
    }
    //  console.log(this.finalArr);
    //  console.log(this.finalArr.length);
    /*this.httpService.commonGet('assets/json/initialReport.config.json').subscribe((yearlyReportConfig) => {
   
      this.yearlyReportConfigData = yearlyReportConfig;
      let initialReportKeys = [];
      initialReportKeys = Object.keys(this.yearlyReportConfigData);
      console.log("yearlyReportConfig:"+initialReportKeys);
       let data = [];
          initialReportKeys.forEach(element => {
            // if (this.yearlyAllData.find((x) =>  (x['quarter'] === 2 && x['vital'] === element))){
            //   data.push({vital:this.yearlyAllData.find((x) => x['vital']), perq2:this.yearlyAllData.find((x) => x['performance'])
            // });
            // }

            for(var i = 0; i < this.yearlyAllData.length; i++){
                    if(this.yearlyAllData[i].quarter === 2 && this.yearlyAllData[i].vital === element){
                      data.push({vital:this.yearlyAllData[i].vital, perq2:this.yearlyAllData[i].performance})
                    }
                    if(this.yearlyAllData[i].quarter === 3 && this.yearlyAllData[i].vital === element){
                      data.push({ perq3:this.yearlyAllData[i].performance})
                    }
            }
            console.log(data);
            
          });
  });*/

  }, 3000);

  
  }

  /*yearlyQ1Report() {
    const params = this.yearlyInput;
    params.quarter = 1;
    return this.httpService.commonPost(appConstants.apiBaseUrl + 'get_medical_report', params);
  } 

  yearlyQ2Report() {
    const params = this.yearlyInput;
    params.quarter = 2;
    return this.httpService.commonPost(appConstants.apiBaseUrl + 'get_medical_report', params);
  } 
  yearlyQ3Report() {
    const params = this.yearlyInput;
    params.quarter = 3;
    return this.httpService.commonPost(appConstants.apiBaseUrl + 'get_medical_report', params);
  } 
  yearlyQ4Report() {
    const params = this.yearlyInput;
    params.quarter = 4;
    return this.httpService.commonPost(appConstants.apiBaseUrl + 'get_medical_report', params);
  } */


  getTargetYearlyReportBySubscriber(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getTargetYearlyReport', { }).subscribe(res => {
    
      console.log(res);
      let finalYearArr = [];
      let finalCvdArr = [];
            for(this.yearlyObj.subscription_id in res.data){
              // console.log(this.yearlyObj.subscription_id);
              
              if(res.data.hasOwnProperty(this.yearlyObj.subscription_id)){
                  const element = res.data[this.yearlyObj.subscription_id];
                  // console.log(element);
                  for(const key1 in element){
                      if(element.hasOwnProperty(key1)){
                        const element1 = element[key1];
                        for(const key2 in element1){
                          if(element1.hasOwnProperty(key2)){
                            const element2 = element1[key2];
                          finalYearArr.push(element2);
                          }
                      }
                      }
                  }
              }
            }
            
            /*for(var key in res.data_ascvd[this.yearlyObj.subscription_id])
            {
                if(res.data_ascvd.hasOwnProperty(key))
                {
                    result.push({
                        key: key,
                        value: res.data_ascvd[key]
                    });
                }
            }
            console.log(result);*/

        console.log(res.data_ascvd[this.yearlyObj.subscription_id]);
        
           

          this.yearlyCvd = Object.keys(res.data_ascvd[this.yearlyObj.subscription_id]).map(key => {
            return {
              quarter: key,
              value: res.data_ascvd[this.yearlyObj.subscription_id][key]
            };
          })

        console.log(this.yearlyCvd);
        


            let groups = new Set(finalYearArr.map(item => item.item));
            
            groups.forEach(g => 
              this.yearlyReportData.push({
                name: g, 
                values: finalYearArr.filter(i => i.item === g)
              }
            ))
            // console.log(this.yearlyReportData);
            
    });

    
  }


  /*groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
       const key = obj[property];
       if (!acc[key]) {
          acc[key] = [];
       }
       // Add object to list for given key's value
       acc[key].push(obj);
       return acc;
    }, {});
 }*/


 
 getTargetYearlyReportBySubId(){
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getTargetYearlyReport', {  sub_id: sessionStorage.getItem("healthDataBySub") }).subscribe(res => {
  
    console.log(res);
    let finalYearArr = [];
    let finalCvdArr = [];
          for(this.yearlyObj.subscription_id in res.data){
            // console.log(this.yearlyObj.subscription_id);
            
            if(res.data.hasOwnProperty(this.yearlyObj.subscription_id)){
                const element = res.data[this.yearlyObj.subscription_id];
                // console.log(element);
                for(const key1 in element){
                    if(element.hasOwnProperty(key1)){
                      const element1 = element[key1];
                      for(const key2 in element1){
                        if(element1.hasOwnProperty(key2)){
                          const element2 = element1[key2];
                        finalYearArr.push(element2);
                        }
                    }
                    }
                }
            }
          }
          
          /*for(var key in res.data_ascvd[this.yearlyObj.subscription_id])
          {
              if(res.data_ascvd.hasOwnProperty(key))
              {
                  result.push({
                      key: key,
                      value: res.data_ascvd[key]
                  });
              }
          }
          console.log(result);*/

      console.log(res.data_ascvd[this.yearlyObj.subscription_id]);
      
         

        this.yearlyCvd = Object.keys(res.data_ascvd[this.yearlyObj.subscription_id]).map(key => {
          return {
            quarter: key,
            value: res.data_ascvd[this.yearlyObj.subscription_id][key]
          };
        })

      console.log(this.yearlyCvd);
      


          let groups = new Set(finalYearArr.map(item => item.item));
          
          groups.forEach(g => 
            this.yearlyReportData.push({
              name: g, 
              values: finalYearArr.filter(i => i.item === g)
            }
          ))
          // console.log(this.yearlyReportData);
          
  });

  
}


}
