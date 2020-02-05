import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn, Validators } from "@angular/forms";
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { DataService } from "../services/data.service";
import { AuthService } from '../auth.service';
import appConstants from '../config/app.constants';
import { UtilService } from '../services/util.service';
import * as moment from 'moment';

@Component({
  selector: 'app-progress-report',
  templateUrl: './progress-report.component.html',
  styleUrls: ['./progress-report.component.css']
})
export class ProgressReportComponent implements OnInit {

  constructor(private httpService: HttpService, private data: DataService, private formBuilder: FormBuilder, public auth: AuthService, private router: Router, private utilService: UtilService) { }
  user_id: string;
  isViewOnly = false;
  progressData;
  isEdit = false;
  progressReportForm;
  ten_year_ascvd;
  quartlyInput;
  userData;
  date;
  firstday;
  diff;
  userProfileData;

  ngOnInit() {
    
    this.data.getProfileData.subscribe(userDetails => this.userData = userDetails );
    if (this.auth.isSubscriber()) {//====== if Subascriber Take user_id from session.=====
      this.user_id = JSON.parse(sessionStorage.getItem('userdata')).user_id;
      this.isViewOnly = true;
      this.getTenYearsCvdRisk();
    } else if (this.auth.isDoctor()) {
      this.data.getSubscriberId.subscribe(subscriber_id => this.user_id = subscriber_id);
    }
    
    // console.log(this.userData)
    this.progressReportForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      mrn: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      id_no: ['', [Validators.required]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      entry_date: ['', [Validators.required]],
      entry_by: ['', [Validators.required]],
      risk_coronary_artery_disease_score: [this.ten_year_ascvd, [Validators.required]],
      free_notes: ['', [Validators.required]]
    });

    this.progressReport();

    if (this.isViewOnly) {
      this.progressReportForm.disable();
    }

  }

  progressReport() {
    this.httpService.commonPost(appConstants.apiBaseUrl + 'get_progress_report', { user_id: this.user_id }).
      subscribe((data) => {
        this.progressData = data.data[0];
        // console.log(new Date(this.progressData.dob).toDateString());
        //console.log(this.progressData.dob);

        if (data.status) {
          if (data.data[0] !== undefined) {
            this.isEdit = true;
            //pathch values from progressReportForm
            this.progressReportForm.patchValue({  
              id_no: this.progressData.id_no,
              gender: this.progressData.gender,
              entry_date: this.entryDateDisplay(this.progressData.entry_date),
              entry_by: this.getEntryName(this.progressData.entry_by),
              risk_coronary_artery_disease_score: this.ten_year_ascvd,
              free_notes: this.progressData.free_notes,
            });
            this.profileFormReport();
          }
          //If New User/
          if (data.data.length === 0 && data.data[0] === undefined) {
            this.isEdit = true;
            this.profileFormReport();
          }
          
        }
      //  alert(this.ten_year_ascvd);
      });
  }

  profileFormReport(){
    this.httpService.commonPost(appConstants.apiBaseUrl + 'get_subscriber_details', { user_id: this.user_id }).
    subscribe((data) => {
      this.userProfileData = data.data[0];
      this.data.setProfileData(this.userProfileData); 
      this.progressReportForm.patchValue({
        name: this.userProfileData.first_name + " " +this.userProfileData.last_name,
        mrn: this.userProfileData.mrn,
        dob: formatDate(this.userProfileData.dob, 'dd-MM-yyyy', 'en'),
        age: this.utilService.getAge(this.userProfileData.dob),
        gender: this.userProfileData.gender
      });
      this.data.getProfileData.subscribe(userDetails => { this.userData = userDetails; this.getTenYearsCvdRisk(); });
      
    });
  }

  entryDateDisplay(date){
    if (this.auth.isSubscriber()) {
      return formatDate(date, 'dd-MM-yyyy', 'en');
    } else if (this.auth.isDoctor()) {
      return formatDate(new Date(), 'dd-MM-yyyy', 'en');
    }
  }
 
  getEntryName(name){
    return this.auth.isDoctor() ? this.auth.username() : name;
  }
  


  getTenYearsCvdRisk(){
    // console.log(this.userData.race);
    this.httpService.commonPost(appConstants.apiBaseUrl + 'get_cvd_risk', {"user_id": this.user_id ,"year": moment().year(),"quarter": moment().quarter() }).subscribe((resp) => {
       let risk_op = resp.data;
       if(resp.data.optimal_values.length > 0){
        // optimal_values
        this.ten_year_ascvd  = parseFloat(resp.data.optimal_values.find( x=> x.names.toLowerCase() === this.userData.race.toLowerCase()).ten_year_ascvd).toFixed(2)
        this.progressReportForm.patchValue({
          risk_coronary_artery_disease_score: this.ten_year_ascvd,
        });
      }
    },(err) => { console.log(err) });
  }

  onSubmit() {
    let progressValues = this.progressReportForm.value;
    progressValues["user_id"] = this.user_id;
    progressValues.dob= moment(progressValues.dob, "DD-MM-YYYY").format("YYYY-MM-DD")
    progressValues.entry_date= moment(progressValues.entry_date, "DD-MM-YYYY").format("YYYY-MM-DD")
    progressValues.risk_coronary_artery_disease_score = Math.round(progressValues.risk_coronary_artery_disease_score)
    // progressValues.dob= moment(progressValues.dob).format("YYYY-MM-DD");
    // progressValues.entry_date= moment(progressValues.entry_date, "YYYY-MM-DD");

    if (this.isEdit) {//====== While edit call Upadte REST API
      this.httpService.commonPost(appConstants.apiBaseUrl + 'update_progress_report', progressValues).subscribe(data => {
        // console.log(data, "Progress Report Updated Successfully.");
        this.utilService.toastrSuccess(data.message, "Progress Report");
      }, (err) => {
        console.log(err);
        this.utilService.toastrError("Progress Report Updated Failed !.("+err.error.message.routine+")", "Progress Report");
      });
    } else { //====== Progress Report =====
      this.httpService.commonPost(appConstants.apiBaseUrl + 'create_progress_report', progressValues).subscribe(data => {
        // console.log(data, "Progress Report Created Successfully.!.");
        this.utilService.toastrSuccess(data.message, "Progress Report");
      },
        (err) => {
          console.log(err);
          this.utilService.toastrError(err.error.message.routine, "Progress Report");
        });
    }

  }

  ngOnDestroy(): void {
    
  }
}
