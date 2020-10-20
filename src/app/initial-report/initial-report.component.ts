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
    selector: 'app-initial-report',
    templateUrl: './initial-report.component.html',
    styleUrls: ['./initial-report.component.css']
})
export class InitialReportComponent implements OnInit {

    initialReportForm;
    alerttDetails: boolean = false;
    initialReportData = [];
    isEditable = false;
    initialReportConfigData;
    user_id: string;
    form_group_ceate: any;
    empObj = {};
    isViewOnly = false;
    isEdit = false;
    healthReportServiceSubscribe;
    initial = {};
    target = {};
    defaultTargetValues = ["0", "60-90", "120-140", "60-90", "<25", "10000", "<6.5", ">1.5", "<2.6", "<5.2", "<0.9", "<1.7"];
    editableFields = [
        "HBA1C",
        "HDL_Cholesterol",
        "LDL_Cholesterol",
        "Total_Cholesterol",
        "WHR",
        "Triglycerides"
    ];
    vitalList = [];
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

        public firstArray = [
        {title: "Body Weight", values: 0},
        {title: "Systolic", values: "0"},
        {title: "Diastolic", values: "0"},
        {title: "Heart Rate", values: "65"},
        {title: "Average Steps taken", values: "2597"},
        {title: "Body Mass Index (BMI)", values: 0}
];
public secondArray = [
     {id: 101, desc: "Body Weight"},
     {id: 102, desc: "Heart Rate"},
     {id: 103, desc: "Systolic"},
     {id: 104, desc: "Diastolic"},
     {id: 105, desc: "Body Mass Index (BMI)"},
     {id: 106, desc: "Average Steps taken"},
     {id: 107, desc: "Sugar - HBA1C *"},
     {id: 108, desc: "HDL Cholesterol *"},
     {id: 109, desc: "LDL Cholesterol *"},
     {id: 110, desc: "Total Cholesterol *"},
     {id: 111, desc: "Waist Hip Ratio"},
     {id: 112, desc: "Triglycerides"},
    ];
    public thirdArray  =[];

    ngOnInit() {
      
        if (this.auth.isSubscriber()) {//====== if Subascriber Take user_id from session.=====
            this.patchSubData();
            this.isViewOnly = true;
            this.isEditable = true;
        }
        if (this.auth.isDoctor()) {//====== if Subascriber Take user_id from session.=====
            this.patchDocData();
            this.isViewOnly = false;
            this.isEditable = false;
        }

       
        for (var j = 0;  j < this.secondArray.length; j++) {
            for (var i = 0;  i < this.firstArray.length; i++) {
                if (this.secondArray[j].desc == this.firstArray[i].title) {
                    this.thirdArray.push({
                            category_id : this.secondArray[j].id,
                            category_name : this.firstArray[i].title,
                            initial : this.firstArray[i].values,
                            target :'0.00'
                        })
                        break;
                } else if((this.secondArray[j].desc != this.firstArray[i].title) && (i == this.firstArray.length - 1)){
                    this.thirdArray.push({
                        category_id : this.secondArray[j].id,
                        category_name : this.secondArray[j].desc,
                        initial : '0.00',
                        target : '0.00'
                    })
                }
               
            }
        }
        
            
        // this.healthReportServiceSubscribe = this.healthReportService.user_id_emitter.subscribe((e) => {
           /* if (this.auth.isDoctor()) {
                // this.user_id = e; //==== any one is fine... below one
                this.data.getSubscriberId.subscribe(subscriber_id => this.user_id = subscriber_id);
            }*/
          /*  this.httpService.commonGet('assets/json/initialReport.config.json').subscribe((initialReportConfig) => {
                this.initialReportConfigData = initialReportConfig;
                this.fetchInitialReportData().subscribe((resp) => {
                    this.isEdit = true;
                    this.initialReportData = resp.data;
                    // let data = this.initialReportData;
                    //===== Filter the data order By ======//
                    let initialReportKeys = Object.values(this.initialReportConfigData);
                    
                    let data = []
                    initialReportKeys.forEach(element => {
                        if (this.initialReportData.find((x) => x['category_name'] == element)) {
                            data.push(this.initialReportData.find((x) => x['category_name'] == element));
                        }
                    });
                    //========Filnal Fitered and sort order data ===
                    this.initialReportData = data;
                    this.form_group_ceate = data.map(x => x.category_name);
                    this.form_group_ceate.map((x) => { return this.empObj[x] = new FormGroup(this.basicInputObject()) });
                    this.initialReportForm = new FormGroup(this.empObj);
                    
                    let patchValObj = {};
                    
                    this.form_group_ceate.forEach(element => {
                        patchValObj[element] = data.find((x) => x['category_name'] == element);
                    });
                    
                    this.initialReportForm.patchValue(patchValObj);
                    if (this.isViewOnly) {//==== For Subscriber only view ====
                        this.initialReportForm.disable();
                    }
                }, (err) => {
                    this.utilService.toastrError("Not able to Load the data.", "Initial Report");
                });
            });*/
        // })
    }

    patchSubData(){
        this.fetchInitialReportData().subscribe((resp) => {
              this.initialReportData = resp.data;
        });
    }

    patchDocData(){
        this.data.getSubscriberId.subscribe(subscriber_id => this.user_id = subscriber_id);
        console.log(this.user_id);
        
        this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getSubscriberInitialTarget', { sub_id: sessionStorage.getItem("healthDataBySub")}).subscribe(resp => {
            // this.initialReportData = resp.data;
            console.log(resp.data);
            if(resp.data.length > 0){
                this.initialReportData = resp.data;
            } else{
                console.log("further Implementation");
                this.getVitalList();
            }
          });
    }



    getVitalList(){
        
        this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getVitalList', { }).subscribe(resp => {
            // this.initialReportData = resp.data;
            // console.log(resp.data);
            this.vitalList = resp.data;
            /*for(let j = 0; j < this.vitalList.length; j++){
                for(let k = 0; k < this.defaultTargetValues.length; k++){
                this.vitalList[j]['target'] = this.defaultTargetValues[k];
                }
              }*/
              
            console.log(this.vitalList);
            this.getLatestDeviceData();
          });
    }

    getLatestDeviceData(){
        let arrayF = [];
        this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getLatestDeviceData', { sub_id: sessionStorage.getItem("healthDataBySub") }).subscribe(resp => {
            // this.initialReportData = resp.data;
            // console.log(resp.data);
            // for (let [key, value] of Object.entries(resp.data)) {
            //     console.log(key, value);
            // }
            console.log(this.healthDataConfig);
            for(let j = 0; j <= this.healthDataConfig.length - 1; j++){
                for (let [key, value] of Object.entries(resp.data)) {
                    // console.log(key, value);
                    if(this.healthDataConfig[j].category == key){
                        if(this.healthDataConfig[j].category == 'bp'){
                             let bpValue = resp.data.bp;
                             
                             let res = bpValue.split("/");
                             let sysVal = res[0].trim();
                             let diaVal = res[1].trim();
                             arrayF.push({ title: "Systolic", values: sysVal},
                                          { title: "Diastolic", values: diaVal});
                        }else{
                            arrayF.push({title: this.healthDataConfig[j].title, values: value});
                        }
                    }

                }

            }
            
           
        //   console.log(arrayF);
        //     console.log(this.vitalList);
            
            
                for(let k = 0; k < this.vitalList.length; k++){
                    for(let i = 0; i < arrayF.length; i++){
                      if(this.vitalList[k].desc == arrayF[i].title){
                          console.log(arrayF[i].values);
                          
                            this.initialReportData.push({
                                category_id: this.vitalList[k].id,
                                category_name: arrayF[i].title,
                                initial: arrayF[i].values === null ? "0" : arrayF[i].values
                            });
                            break;
                      } else if((this.vitalList[k].desc != arrayF[i].title) && (i == arrayF.length - 1)){
                        this.initialReportData.push({
                            category_id : this.vitalList[k].id,
                            category_name : this.vitalList[k].desc,
                            initial : '0'
                        })
                    }
                }
            }
            // console.log(this.initialReportData);
            for(let l=0; l < this.initialReportData.length; l++){
                 if(this.initialReportData[l].category_name == "Body Weight"){
                    this.initialReportData[l]['target'] = "0";
                 }
                 if(this.initialReportData[l].category_name == "Heart Rate"){
                    this.initialReportData[l]['target'] = "60-90";
                 }
                 if(this.initialReportData[l].category_name == "Systolic"){
                    this.initialReportData[l]['target'] = "120-140";
                 }
                 if(this.initialReportData[l].category_name == "Diastolic"){
                    this.initialReportData[l]['target'] = "60-90";
                 }
                 if(this.initialReportData[l].category_name == "Body Mass Index (BMI)"){
                    this.initialReportData[l]['target'] = "<25";
                 }
                 if(this.initialReportData[l].category_name == "Average Steps taken"){
                    this.initialReportData[l]['target'] = "10000";
                 }
                 if(this.initialReportData[l].category_name == "Sugar - HBA1C *"){
                    this.initialReportData[l]['target'] = "<6.5";
                 }
                 if(this.initialReportData[l].category_name == "HDL Cholesterol *"){
                    this.initialReportData[l]['target'] = ">1.5";
                 }
                 if(this.initialReportData[l].category_name == "LDL Cholesterol *"){
                    this.initialReportData[l]['target'] = "<2.6";
                 }
                 if(this.initialReportData[l].category_name == "Total Cholesterol *"){
                    this.initialReportData[l]['target'] = "<5.2";
                 }
                 if(this.initialReportData[l].category_name == "Waist Hip Ratio"){
                    this.initialReportData[l]['target'] = "<0.9";
                 }
                 if(this.initialReportData[l].category_name == "Triglycerides"){
                    this.initialReportData[l]['target'] = "<1.7";
                 }

            }
            console.log(this.initialReportData);
        });
    }

   

    onClickData(){
        // let initial = {};
        // let target = {};
        // console.log(this.initialReportData);
        // console.log(this.user_id);

        for(let j = 0; j <= this.initialReportData.length - 1; j++){
              if(this.initialReportData[j].initial != "" && this.initialReportData[j].target != ""){
                this.initial[this.initialReportData[j].category_id] = this.initialReportData[j].initial;
                this.target[this.initialReportData[j].category_id] = this.initialReportData[j].target;
              } else{
                  let message = "Please Provide Valid";
                  return this.utilService.toastrError(this.initialReportData[j].category_name, message);
              }
            
              
    }
    // console.log(this.user_id);
    // console.log(initial);
    // console.log(target);
    this.alerttDetails = true;
        /*this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'addUpdateInitialReport', 
        { sub_id: sessionStorage.getItem("healthDataBySub"),
          initial: this.initial,
          target: this.target}
        ).subscribe(resp => {
            this.utilService.toastrSuccess("Updated Successfully", "Initial Report");
            this.router.navigate(['home']);
        }, (err) => {
          console.log(err);
          this.utilService.toastrError("Updated Failed", "Initial Report");
        });*/
          
     }
    /*patchSubData(){
        this.fetchInitialReportData().subscribe((resp) => {
            //   console.log(resp.data);
              this.form_group_ceate = resp.data.map(x => x.category_id);
            //   console.log(this.form_group_ceate);
            let initialReportConfig = resp.data.map(x => x.category_name);
            // console.log(this.initialReportConfigData);
            console.log({...initialReportConfig});
            let initialReportConfigKeys = {...initialReportConfig};
            this.initialReportConfigData = Object.values(initialReportConfigKeys);

                    this.form_group_ceate.map((x) => { return this.empObj[x] = new FormGroup(this.basicInputObject()) });
                    this.initialReportForm = new FormGroup(this.empObj);
                    // console.log(this.initialReportForm);
                    let patchValObj = {};
                    
                    this.form_group_ceate.forEach(element => {
                        patchValObj[element] = resp.data.find((x) => x['category_id'] == element);
                    });
                    console.log(patchValObj);
                    
                   this.initialReportForm.patchValue(patchValObj);
                    /*if (this.isViewOnly) {//==== For Subscriber only view ====
                        this.initialReportForm.disable();
                    }
        });
    }*/

   
    basicInputObject() {
        return {
            // date: new FormControl(),
            // ideal: new FormControl(),
            category_id: new FormControl(),
            category_name: new FormControl(),
            initial: new FormControl(),
            target: new FormControl(),
            // user_id: new FormControl(),
            // vital: new FormControl(),
            
        }
    }

    get f() {
        return this.initialReportForm.controls;
    }
    onSubmit() {
        // console.log(this.initialReportForm.value);
        let inputInitialFormData = _.values(this.initialReportForm.value);
        let changedInputParams = this.utilService.diffObjects(this.initialReportData, inputInitialFormData);
        let updatePromises = [];
        // console.log(changedInputParams)
        if (!_.isEmpty(changedInputParams)) {
            // console.log(changedInputParams)
            for (const key in changedInputParams) {
                // console.log(changedInputParams[key]);
                let promise = new Promise((resolve, reject) => {
                    this.httpService.commonPost(appConstants.apiBaseUrl + 'update_doctor_initial_report', changedInputParams[key]).
                        subscribe((data) => {
                            // console.log(data);
                            resolve(data);
                        },
                            (err) => { reject(err) });
                });
                updatePromises.push(promise)
            }
            Promise.all(updatePromises).then((res) => {
                console.log(res);
                this.utilService.toastrSuccess(res[0].message, "Initial Report");
            }).catch((err) => {
                console.log(err);
                this.utilService.toastrError("Update Failed", "Initial Report");
            });
        } else if (_.isEmpty(changedInputParams)) {
            this.utilService.toastrInfo("you have not modified any data. Please modify and update.", "Initial Report");
        }

    }
    //======= Get patient initial Report ========//
    fetchInitialReportData() {
        return this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getMyInitialTarget', { });
    }
    
    /*isEditable(filed_name){
       return this.auth.isDoctor() ? !_.contains(this.editableFields, filed_name) : this.isViewOnly;
    }
    ngOnDestroy(): void {
        // this.healthReportService.user_id_emitter.unsubscribe(); //Bad Way to unsubscribe
        this.healthReportServiceSubscribe.unsubscribe();
    }*/

    openAlertModal(){
        this.alerttDetails = true;
      }
    
      closeAlertModal(){
        this.alerttDetails = false;
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
