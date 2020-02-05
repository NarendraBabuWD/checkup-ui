import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { AuthService } from '../auth.service';
import { DataService } from "../services/data.service";
import * as _ from 'underscore';
import { UtilService } from '../services/util.service';
import appConstants from '../config/app.constants';
import { MyHealthReportService } from '../services/my-health-report.service';

@Component({
  selector: 'app-quarterly-report',
  templateUrl: './quarterly-report.component.html',
  styleUrls: ['./quarterly-report.component.css']
})
export class QuarterlyReportComponent implements OnInit {

  constructor(private httpService: HttpService, private formBuilder: FormBuilder, private auth: AuthService,
    private data: DataService, private utilService: UtilService, private healthReportService: MyHealthReportService) { }
  quartlyInput;
  quartlyData = [];
  user_id: string;
  quartlyReportForm: FormGroup;// ====== intailze Form Group
  empFormObj = {};
  form_group_ceate: any;
  initialReportConfigData;
  isViewOnly = false;
  isEdit = false;
  healthReportServiceSubscribe;
  editableFields = [
    "HBA1C",
    "HDL_Cholesterol",
    "LDL_Cholesterol",
    "Total_Cholesterol",
    "WHR",
    "Triglycerides"
  ];
  ten_year_ascvd;
  userData;

  ngOnInit() {
    
    this.data.getQuartelyReport.subscribe(quartlyInput => this.quartlyInput = quartlyInput);
    // console.log(this.quartlyInput);
    if (this.auth.isSubscriber()) {//====== if Subascriber Take user_id from session.=====
      this.user_id = JSON.parse(sessionStorage.getItem('userdata')).user_id;
      this.isViewOnly = true;
    }
    this.data.getProfileData.subscribe(userDetails => this.userData = userDetails );
    //======= Create a Form ====
    // this.initialReportForm = new FormGroup(this.empObj);
    this.quartlyReportForm = this.formBuilder.group(this.empFormObj);
    this.healthReportServiceSubscribe = this.healthReportService.user_id_emitter.subscribe((e) => {
      if (this.auth.isDoctor()) {
        this.user_id = e.user_id; //==== any one is fine... below one
        // this.data.getSubscriberId.subscribe(subscriber_id => this.user_id = subscriber_id);
      }
      this.httpService.commonGet('assets/json/initialReport.config.json').subscribe((initialReportConfig) => {
        this.initialReportConfigData = initialReportConfig;
        this.getTenYearsCvdRisk();
        this.quartlyReport().subscribe((resp) => {
          this.isEdit = true;
          this.quartlyData = resp.data;
          // let data = this.quartlyData;
          //===== Filter the data order By ======//
          let initialReportKeys = Object.keys(this.initialReportConfigData);
          let data = []
          initialReportKeys.forEach(element => {
            if (this.quartlyData.find((x) => x['vital'] === element)) {
              data.push(this.quartlyData.find((x) => x['vital'] === element));
            }
          });
          //========Filnal Fitered and sort order data ===
          this.quartlyData = data;
          // console.log(data);
          this.form_group_ceate = data.map(x => x.vital);
          this.form_group_ceate.map((x) => { return this.empFormObj[x] = new FormGroup(this.basicInputObject()) });
          this.quartlyReportForm = new FormGroup(this.empFormObj);
          let patchValObj = {};
          // console.log(data);
          this.form_group_ceate.forEach(element => {
            patchValObj[element] = data.find((x) => x['vital'] === element);
            if (this.auth.isSubscriber()) {
              patchValObj[element].performance = this.performanceClaculation(patchValObj[element]);
            }
          });
          this.quartlyReportForm.patchValue(patchValObj);
          if (this.isViewOnly) {//==== For Subscriber only view his report ====
            this.quartlyReportForm.disable();
          }
        },
          (err) => {
            console.log(err);
            this.utilService.toastrError("Not able to Load the data.", "Quartely Report");
          });
      });
    });

  }

  performanceClaculation(obj) {
    // console.log(obj);
    let performance;

    if (obj.vital === 'dia' || obj.vital === 'sys' || obj.vital === 'heart_rate' || obj.vital === 'steps') {
      performance = (parseFloat(obj.normal_count) / parseFloat(obj.total_count)) * 100;
    }
    if (obj.vital === 'body_weight' || obj.vital === 'bmi' || obj.vital === 'bmr' || obj.vital === 'visceral_fat' || obj.vital === 'fat' || obj.vital === 'bodyage' || obj.vital === 'moisture' || obj.vital === 'muscle') {
      performance = ((parseFloat(obj.initial) - parseFloat(obj.achieved)) / (parseFloat(obj.initial) - parseFloat(obj.target))) * 100;
    }
    if (obj.vital === 'HBA1C' || obj.vital === 'HDL_Cholesterol' || obj.vital === 'LDL_Cholesterol' || obj.vital === 'Total_Cholesterol' || obj.vital === 'WHR' || obj.vital === 'Triglycerides') {
      performance = ((parseFloat(obj.target) - parseFloat(obj.achieved)) / parseFloat(obj.target)) * 100;
    }
    // if (obj.vital === 'steps') {
    //   performance = 1;
    // }
    //=== If '-' Out side target , '+' Target recahed
    // switch (obj) {
    //   case obj.vital === 'dia' || obj.vital === 'sys' || obj.vital === 'heart_rate':
    //     performance = (parseFloat(obj.normal_count) / parseFloat(obj.total_count)) * 100 ;
    //     break;
    //   case obj.vital === 'body_weight' || obj.vital === 'bmi' || obj.vital === 'bmr' || obj.vital === 'visceral_fat' || obj.vital === 'muscle':
    //     performance = ((parseFloat(obj.initial) - parseFloat(obj.achieved)) / (parseFloat(obj.initial) - parseFloat(obj.target))) * 100 ;
    //     break;
    //   case obj.vital === 'HBA1C' || obj.vital === 'HDL_Cholesterol' || obj.vital === 'LDL_Cholesterol' || obj.vital === 'Total_Cholesterol':
    //     performance = ((parseFloat(obj.target) - parseFloat(obj.achieved)) / parseFloat(obj.target)) * 100 ;
    //     break;
    //   case obj.vital === 'steps':
    //     performance = 0;
    //     break;
    //   default:
    // }
    performance = (performance === undefined || performance === null || isNaN(performance) ? 0 : performance.toFixed(2))
    return performance;
  }

  quartlyReport() {
    const params = this.quartlyInput;
    return this.httpService.commonPost(appConstants.apiBaseUrl + 'get_medical_report', params);
  }

  basicInputObject() {
    return {
      "vital": new FormControl(),
      "quarter": new FormControl(),
      "year": new FormControl(),
      "user_id": new FormControl(),
      "initial": new FormControl(),
      "target": new FormControl(),
      "achieved": new FormControl(),
      "performance": new FormControl(),
      "normal_count": new FormControl(),
      "total_count": new FormControl(),
      "target_new": new FormControl(),
      "id": new FormControl()
    }
  }
  get f() {
    return this.quartlyReportForm.controls;
  }
  onSubmit() {
    // console.log(this.initialReportForm.value);
    let inputInitialFormData = _.values(this.quartlyReportForm.value);
    let changedInputParams = this.utilService.diffObjects(this.quartlyData, inputInitialFormData);
    // console.log(changedInputParams);
    let updatePromises = [];
    if (!_.isEmpty(changedInputParams)) {
      for (const key in changedInputParams) {
        // console.log(changedInputParams[key]);
        //========= Remove % from Pentage field =========//
        // changedInputParams[key].performance = changedInputParams[key].performance.replace(/%/, '') === '--' ? null : changedInputParams[key].performance.replace(/%/, '')
        let promise = new Promise((resolve, reject) => {
          this.httpService.commonPost(appConstants.apiBaseUrl + 'create_quarter_initial_report', changedInputParams[key]).
            subscribe((data) => {
              resolve(data);
            },
              (err) => { reject(err) });
        });
        updatePromises.push(promise)
      }

      Promise.all(updatePromises).then((res) => {
        console.log(res);
        this.utilService.toastrSuccess(res[0].message, "Quartely Report");
      }).catch((err) => {
        console.log(err);
        this.utilService.toastrError("Update Failed", "Quartely Report");
      });

    } else if (_.isEmpty(changedInputParams)) {
      this.utilService.toastrInfo("You have not modified any data. Please modify and update.", "Quartely Report");
    }
  }

  getTenYearsCvdRisk(){
    this.httpService.commonPost(appConstants.apiBaseUrl + 'get_cvd_risk', this.quartlyInput).subscribe((resp) => {
       let risk_op = resp.data;
       if(resp.data.optimal_values){
        // optimal_values
        this.ten_year_ascvd = parseFloat(resp.data.optimal_values.find(  x=> x.names.toLowerCase() === this.userData.race.toLowerCase()).ten_year_ascvd).toFixed(2)
       }
    },(err) => { console.log(err) });
  }
  
  performanceText(filed_name){
    let performance_val =  this.quartlyReportForm.get(filed_name).value.performance 
    //let final_performance = performance_val.replace(/%/, '') === 0 ? -1 :performance_val.replace(/%/, '')
   return Math.round(performance_val) < 1 ? 'Out side target' : ' Target recahed';
  }

  finalPerformanceValue(filed_name){
    return Math.abs(this.quartlyReportForm.get(filed_name).value.performance);
  }

  isEditable(filed_name){
    return this.auth.isDoctor() ? !_.contains(this.editableFields, filed_name) : this.isViewOnly;
  }
  
  ngOnDestroy(): void {  
    this.healthReportServiceSubscribe.unsubscribe();
  }

}
