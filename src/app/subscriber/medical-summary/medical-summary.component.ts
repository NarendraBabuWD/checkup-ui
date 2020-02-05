import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn, Validators } from "@angular/forms";
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { DataService } from "../../services/data.service";
import { AuthService } from '../../auth.service';
import appConstants from '../../config/app.constants';
import { UtilService } from '../../services/util.service';
import * as moment from 'moment';
import * as _ from 'underscore';

@Component({
  selector: 'app-medical-summary',
  templateUrl: './medical-summary.component.html',
  styleUrls: ['./medical-summary.component.css']
})
export class MedicalSummaryComponent implements OnInit {

  constructor(private httpService: HttpService, private data: DataService, private formBuilder: FormBuilder, private auth: AuthService, private router: Router, private utilService: UtilService) { }
  subscriberMedicalSummaryForm: FormGroup;// ====== intailze Form Group
  submitted = false;
  user_id: string;
  isSMHSelected = '';
  isPSHSelected = '';
  isDurgAliergiesSelected = '';
  isCurrentMedicaionSelected = '';
  heartSurgerySelected = false;
  userDetails: {};
  yearList: any;
  durgAliergies_list = [];
  currentMedication_list = [];
  smh_list = [];
  psh_list = [];
  heartSurgery_list = [];
  created_date: string;
  isEdit = false;
  isViewOnly = false;
  medicalSummaryAPIRes: any;
  userHasProfile = false;
  userProfileData;

  ngOnInit() {

    if (this.auth.isSubscriber()) {//====== if Subascriber Take user_id from session.=====
      this.user_id = JSON.parse(sessionStorage.getItem('userdata')).user_id;
      this.isViewOnly = true;
    } else if (this.auth.isDoctor()) {
      this.data.getSubscriberId.subscribe(subscriber_id => this.user_id = subscriber_id);
    }
    // console.log(this.user_id)
    this.getYearList();
    this.formBuilderForMS();
    this.buildMedicalSummaryForm();
    this.setYearAndMimumLengthValidators();
    if (this.isViewOnly) {//==== For Subscriber only view his medical summary ====
      this.subscriberMedicalSummaryForm.disable();
    }
    this.profileDate();//=====
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.subscriberMedicalSummaryForm.controls;
  }
  getYearList() {
    let year = new Date().getFullYear();
    this.yearList = [];
    for (var i = 0; i < 25; i++) {
      this.yearList.push(year - i);
    }
  }

  getDurgAliergies() {
    return [
      { value: "amoxicillin", name: 'Amoxicillin', isYear: true },
      { value: "penicillin", name: 'Penicillin', isYear: true }
    ];
  }
  getcurrentMedication() {
    return [
      { value: "plavix75mg", name: 'Plavix 75mg', isYear: true },
      { value: "crestor5mg", name: 'Crestor 5mg', isYear: true }
    ];
  }
  getSMH() {
    return [
      { value: "nil", name: 'Nil', isYear: true },
      { value: "hypertension", name: 'Hypertension', isYear: true },
      { value: "diabetes", name: 'Diabetes', isYear: true },
      { value: "highCholesterol", name: 'High Cholesterol', isYear: true },
      { value: "smoking", name: 'Smoking', isYear: true },
      { value: "stroke", name: 'Stroke', isYear: true },
      { value: "chronicKidneyDisease", name: 'Chronic Kidney Disease', isYear: true },
      { value: "familyHistoryOfCAD", name: 'Family History of CAD', isYear: true }
    ];
  }

  getPSH() {
    return [
      { value: "angioplasty", name: 'Angioplasty', isYear: true }
    ];
  }
  getHeartSurgery() {
    return [
      { value: "bypassSurgery", name: 'Bypass Surgery', isYear: true },
      { value: "valveSurgery", name: 'Valve Surgery', isYear: true },
      { value: "aorticSurgery", name: 'Aortic Surgery', isYear: true },
      { value: "congenitalHeartSurgery", name: 'Congenital Heart Surgery', isYear: true },
      { value: "pacemakerImplantation", name: 'Pacemaker Implantation', isYear: true },
      { value: "aICDImplantation", name: 'AICD Implantation', isYear: true },
    ];
  }
  heartSurgeryClick() {
    this.heartSurgerySelected = !this.heartSurgerySelected
  }
  formBuilderForMS() {
    this.created_date = formatDate(new Date(), 'dd-MM-yyyy', 'en');
    //=========== Create a form group By Default =========//
    this.subscriberMedicalSummaryForm = this.formBuilder.group({
      createdOn: [this.created_date, [Validators.required]],
      name: ["", [Validators.required]],
      mrn: [JSON.parse(sessionStorage.getItem('userdata')).mrn],
      dob: ["", [Validators.required]],
      age: ["", [Validators.required]],
      idNo: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      smh: ["", [Validators.required]],
      nil: [""],
      nil_year: [""],
      hypertension: [""],
      hypertension_year: [""],
      diabetes: [""],
      diabetes_year: [""],
      highCholesterol: [""],
      highCholesterol_year: [""],
      smoking: [""],
      smoking_year: [""],
      stroke: [""],
      stroke_year: [""],
      chronicKidneyDisease: [""],
      chronicKidneyDisease_year: [""],
      familyHistoryOfCAD: [""],
      familyHistoryOfCAD_year: [""],
      psh: ["", [Validators.required]],
      // angioplasty: ["", [Validators.required]],
      angioplasty_year: [""],
      heartSurgery: [this.heartSurgerySelected],
      bypassSurgery_year: [""],
      valveSurgery_year: [""],
      aorticSurgery_year: [""],
      congenitalHeartSurgery_year: [""],
      pacemakerImplantation_year: [""],
      aICDImplantation_year: [""],
      durgAliergies: ["", [Validators.required]],
      amoxicillin_year: [""],
      penicillin_year: [""],
      currentMedication: ["", [Validators.required]],
      otherSpecify: [""],
      since_year: [""],
      plavix75mg_year: [""],
      crestor5mg_year: [""],
      otherSpecifyVal: [""],
      durgAliergies_list: new FormArray([]),
      currentMedication_list: new FormArray([]),
      smh_list: new FormArray([]),
      psh_list: new FormArray([]),
      heartSurgery_list: new FormArray([])
    });
    //=== synchronous Load check Boxes ====//.
    this.durgAliergies_list = this.getDurgAliergies();
    this.addDrugCheckboxes(this.durgAliergies_list);
    this.currentMedication_list = this.getcurrentMedication();
    this.addCurrentMedicationCheckboxes(this.currentMedication_list);
    this.smh_list = this.getSMH();
    this.addSMHCheckboxes(this.smh_list);
    this.psh_list = this.getPSH();
    this.addPSHCheckboxes(this.psh_list);
    this.heartSurgery_list = this.getHeartSurgery();
    this.addHeartSurgeryCheckboxes(this.heartSurgery_list);
  }
  buildMedicalSummaryForm() {
    this.httpService.commonPost(appConstants.apiBaseUrl + 'get_medical_summary', { user_id: this.user_id }).subscribe(data => {
      // console.log(data, "get Medical Summary Details.");

      if (data.status) {
        this.medicalSummaryAPIRes = data.data[0];
        this.userHasProfileCheck();
        if (data.data[0] !== undefined) {
          this.isEdit = true;
          this.userDetails = data.data[0];
          // Update the data on the form
          this.isSMHSelected = data.data[0].significant_medical_history.length > 0 ? 'Yes' : 'No';
          let others = data.data[0].others ? data.data[0].others : '';
          this.isPSHSelected = (data.data[0].past_surgical_history.length > 0 ||
            data.data[0].heart_surgery.length > 0 ||
              others.length > 0) ? 'Yes' : 'No';
          this.heartSurgerySelected = data.data[0].heart_surgery.length > 0 ? true : false;
          this.isDurgAliergiesSelected = data.data[0].drug_allergies.length > 0 ? 'Yes' : 'No';
          this.isCurrentMedicaionSelected = data.data[0].current_medication.length > 0 ? 'Yes' : 'No';

          let data_smh_list = data.data[0].significant_medical_history.split(",");
          let data_smh_list_year = data_smh_list.map((v, i) => {
            let tempObj = {}
            v ? (tempObj[v.split(":")[0]] = v.split(":")[1]) : null;
            return tempObj[v.split(":")[0]] !== undefined ? tempObj : null;
          }).filter(n => n);
          data_smh_list = data_smh_list.map((v, i) => {
            return v ? v.split(":")[0] : null
          });

          let data_psh_list = data.data[0].past_surgical_history.split(",");
          let data_psh_list_year = data_psh_list.map((v, i) => {
            let tempObj = {}
            v ? (tempObj[v.split(":")[0]] = v.split(":")[1]) : null;
            return tempObj[v.split(":")[0]] !== undefined ? tempObj : null;
          }).filter(n => n);
          data_psh_list = data_psh_list.map((v, i) => {
            return v ? v.split(":")[0] : null
          });

          let data_heartSurgery_list = data.data[0].heart_surgery.split(',');
          let data_heartSurgery_list_year = data_heartSurgery_list.map((v, i) => {
            let tempObj = {}
            v ? (tempObj[v.split(":")[0]] = v.split(":")[1]) : null;
            return tempObj[v.split(":")[0]] !== undefined ? tempObj : null;
          }).filter(n => n);
          data_heartSurgery_list = data_heartSurgery_list.map((v, i) => {
            return v ? v.split(":")[0] : null
          });

          let data_durgAliergies_list = data.data[0].drug_allergies.split(',');
          let data_durgAliergies_list_year = data_durgAliergies_list.map((v, i) => {
            let tempObj = {}
            v ? (tempObj[v.split(":")[0]] = v.split(":")[1]) : null;
            return tempObj[v.split(":")[0]] !== undefined ? tempObj : null;
          }).filter(n => n);
          data_durgAliergies_list = data_durgAliergies_list.map((v, i) => {
            return v ? v.split(":")[0] : null
          });

          let data_currentMedication_list = data.data[0].current_medication.split(',');
          let data_currentMedication_list_year = data_currentMedication_list.map((v, i) => {
            let tempObj = {}
            v ? (tempObj[v.split(":")[0]] = v.split(":")[1]) : null;
            return tempObj[v.split(":")[0]] !== undefined ? tempObj : null;
          }).filter(n => n);
          data_currentMedication_list = data_currentMedication_list.map((v, i) => {
            return v ? v.split(":")[0] : null
          });

          const smh_edit_list = this.editCheckBoxValues(this.smh_list, data_smh_list);
          const durgAliergies_edit_list = this.editCheckBoxValues(this.durgAliergies_list, data_durgAliergies_list);
          const currentMedication_edit_list = this.editCheckBoxValues(this.currentMedication_list, data_currentMedication_list);
          const psh_edit_list = this.editCheckBoxValues(this.psh_list, data_psh_list);
          const heartSurgery_edit_list = this.editCheckBoxValues(this.heartSurgery_list, data_heartSurgery_list);
          // console.log(data.data[0].created_on);
          this.subscriberMedicalSummaryForm.patchValue({
            // createdOn: formatDate(this.created_date, 'dd-MM-yyyy', 'en'),
            createdOn: this.createOnDate(data.data[0].created_on),
            // mrn: data.data[0].mrn,
            idNo: data.data[0].id_no,
            smh: this.isSMHSelected,
            smh_list: smh_edit_list,
            durgAliergies: this.isDurgAliergiesSelected,
            durgAliergies_list: durgAliergies_edit_list,
            currentMedication: this.isCurrentMedicaionSelected,
            currentMedication_list: currentMedication_edit_list,
            psh: this.isPSHSelected,
            psh_list: psh_edit_list,
            heartSurgery: this.heartSurgerySelected,
            heartSurgery_list: heartSurgery_edit_list,
            nil_year: this.yearFill('nil', data_smh_list_year),
            hypertension_year: this.yearFill('hypertension', data_smh_list_year),
            diabetes_year: this.yearFill('diabetes', data_smh_list_year),
            highCholesterol_year: this.yearFill('highCholesterol', data_smh_list_year),
            smoking_year: this.yearFill('smoking', data_smh_list_year),
            stroke_year: this.yearFill('stroke', data_smh_list_year),
            chronicKidneyDisease_year: this.yearFill('chronicKidneyDisease', data_smh_list_year),
            familyHistoryOfCAD_year: this.yearFill('familyHistoryOfCAD', data_smh_list_year),
            angioplasty_year: this.yearFill('angioplasty', data_psh_list_year),
            bypassSurgery_year: this.yearFill('bypassSurgery', data_heartSurgery_list_year),
            valveSurgery_year: this.yearFill('valveSurgery', data_heartSurgery_list_year),
            aorticSurgery_year: this.yearFill('aorticSurgery', data_heartSurgery_list_year),
            congenitalHeartSurgery_year: this.yearFill('congenitalHeartSurgery', data_heartSurgery_list_year),
            pacemakerImplantation_year: this.yearFill('pacemakerImplantation', data_heartSurgery_list_year),
            aICDImplantation_year: this.yearFill('aICDImplantation', data_heartSurgery_list_year),
            amoxicillin_year: this.yearFill('amoxicillin', data_durgAliergies_list_year),
            penicillin_year: this.yearFill('penicillin', data_durgAliergies_list_year),
            plavix75mg_year: this.yearFill('plavix75mg', data_currentMedication_list_year),
            crestor5mg_year: this.yearFill('crestor5mg', data_currentMedication_list_year),
            otherSpecify: others.length > 0 ? true : false,
            otherSpecifyVal: others.length > 0 ? others.split(":")[0] : "",
            since_year: others.length > 0 ? data.data[0].since_year : ""
          });
        }
        // this.setYearAndMimumLengthValidators();
      }
    });
  }

  profileDate(){
    this.httpService.commonPost(appConstants.apiBaseUrl + 'get_subscriber_details', { user_id: this.user_id }).
    subscribe((data) => {
      this.userProfileData = data.data[0];
      this.data.setProfileData(this.userProfileData); 
      this.subscriberMedicalSummaryForm.patchValue({
        name: this.userProfileData.first_name + " " +this.userProfileData.last_name,
        mrn: this.userProfileData.mrn,
        dob: formatDate(this.userProfileData.dob, 'dd-MM-yyyy', 'en'),
        age: this.utilService.getAge(this.userProfileData.dob),
        gender: this.userProfileData.gender,
      });  
    });
  }
  
  private createOnDate(date){
    return this.auth.isSubscriber() ? moment(date).format("DD-MM-YYYY") : this.created_date
  }
  private yearFill(kpi, list) {
    // console.log(list.filter(x => x[kpi]));
    return list.filter(x => x[kpi]).length > 0 ? list.filter(x => x[kpi])[0][kpi] : '';
  }
  
  userHasProfileCheck() {
    this.userHasProfile = (this.auth.isSubscriber() && this.medicalSummaryAPIRes === undefined);
  }
  private editCheckBoxValues(orginalList, userSelectedList) {
    return orginalList.map(x => userSelectedList.includes(x.value) ? true : false);
  }
  private addDrugCheckboxes(list) {
    list.map((o, i) => {
      const control = new FormControl(i === -1); // if first item set to true, else false then i ==0
      // console.log(control);
      (this.subscriberMedicalSummaryForm.controls.durgAliergies_list as FormArray).push(control);
    });
  }
  private addCurrentMedicationCheckboxes(list) {
    list.map((o, i) => {
      const control = new FormControl(i === -1); // if first item set to true, else false then i ==0
      (this.subscriberMedicalSummaryForm.controls.currentMedication_list as FormArray).push(control);
    });
  }
  private addSMHCheckboxes(list) {
    list.map((o, i) => {
      const control = new FormControl(i === -1); // if first item set to true, else false then i ==0
      (this.subscriberMedicalSummaryForm.controls.smh_list as FormArray).push(control);
    });
  }
  private addPSHCheckboxes(list) {
    list.map((o, i) => {
      const control = new FormControl(i === -1); // if first item set to true, else false then i ==0
      (this.subscriberMedicalSummaryForm.controls.psh_list as FormArray).push(control);
    });
  }
  private addHeartSurgeryCheckboxes(list) {
    list.map((o, i) => {
      const control = new FormControl(i === -1); // if first item set to true, else false then i ==0
      (this.subscriberMedicalSummaryForm.controls.heartSurgery_list as FormArray).push(control);
    });
  }

  onFormSubmit() {
    this.submitted = true;
    // console.log(this.subscriberMedicalSummaryForm.value);
    var inputValues = this.subscriberMedicalSummaryForm.value;
    //========= Construct Json I/P for API  --- UPDATE or CREATE
    const finalJsonInput = {};
    finalJsonInput["created_on"] = moment(inputValues.createdOn, "DD-MM-YYYY").format("YYYY-MM-DD");
    finalJsonInput["user_id"] = this.user_id;
    finalJsonInput["name"] = inputValues.name;
    finalJsonInput["age"] = inputValues.age;
    finalJsonInput["mrn"] = inputValues.mrn;
    finalJsonInput["dob"] = moment(inputValues.dob, "DD-MM-YYYY").format("YYYY-MM-DD")
    finalJsonInput["gender"] = inputValues.gender;
    finalJsonInput["id_no"] = inputValues.idNo;
    

    //============= form an arry list for Drug Allergies ========//
    if (inputValues.durgAliergies === 'Yes') {
      const selectedDrugList = this.subscriberMedicalSummaryForm.value.durgAliergies_list
        // .map((v, i) => v ? this.durgAliergies_list[i].value : null)
        .map((v, i) => {
          let yearVal = inputValues[this.durgAliergies_list[i].value + '_year'] === undefined ? "" : ":" + inputValues[this.durgAliergies_list[i].value + '_year'];
          return v ? this.durgAliergies_list[i].value + yearVal : null
        })
        .filter(v => v !== null);
      // console.log("drug_allergies", selectedDrugList);
      finalJsonInput["drug_allergies"] = selectedDrugList;
    } else {
      finalJsonInput["drug_allergies"] = [];
    }
    //============= form an arry list for Current Medication ========//
    if (inputValues.currentMedication === 'Yes') {
      const selectedCurrentMedicationList = this.subscriberMedicalSummaryForm.value.currentMedication_list
        // .map((v, i) => v ? this.currentMedication_list[i].value : null)
        .map((v, i) => {
          let yearVal = inputValues[this.currentMedication_list[i].value + '_year'] === undefined ? "" : ":" + inputValues[this.currentMedication_list[i].value + '_year'];
          return v ? this.currentMedication_list[i].value + yearVal : null
        })
        .filter(v => v !== null);
      // console.log("selectedCurrentMedicationList", selectedCurrentMedicationList);
      finalJsonInput["current_medication"] = selectedCurrentMedicationList;
    } else {
      finalJsonInput["current_medication"] = [];
    }
    //============= form an arry list for Significant Medical History Medication ========//
    if (inputValues.smh === 'Yes') {
      const selectedSMHList = this.subscriberMedicalSummaryForm.value.smh_list
        .map((v, i) => {
          let yearVal = inputValues[this.smh_list[i].value + '_year'] === undefined ? "" : ":" + inputValues[this.smh_list[i].value + '_year'];
          return v ? this.smh_list[i].value + yearVal : null
        })
        .filter(v => v !== null);
      // console.log("selectedCurrentMedicationList", selectedSMHList);
      finalJsonInput["significant_medical_history"] = selectedSMHList;
    } else {
      finalJsonInput["significant_medical_history"] = [];
    }
    //============= form an arry list for Past  Significant Medical History ========//
    if (inputValues.psh === 'Yes') {
      //============= form an arry list for Heart Surgery ========//
      if (inputValues.heartSurgery) {
        const selectedHeartSurgeryList = this.subscriberMedicalSummaryForm.value.heartSurgery_list
          // .map((v, i) => v ? this.heartSurgery_list[i].value : null)
          .map((v, i) => {
            let yearVal = inputValues[this.heartSurgery_list[i].value + '_year'] === undefined ? "" : ":" + inputValues[this.heartSurgery_list[i].value + '_year'];
            return v ? this.heartSurgery_list[i].value + yearVal : null
          })
          .filter(v => v !== null);
        // console.log("selectedHeartSurgeryList", selectedHeartSurgeryList);
        finalJsonInput["heart_surgery"] = selectedHeartSurgeryList;
      } else {
        finalJsonInput["heart_surgery"] = [];
      }
      if (_.contains(inputValues.psh_list, true)) {
        //============= form an arry list for  Past Surgical History ========//
        const selectedPSHList = this.subscriberMedicalSummaryForm.value.psh_list
          .map((v, i) => {
            let yearVal = inputValues[this.psh_list[i].value + '_year'] === undefined ? "" : ":" + inputValues[this.psh_list[i].value + '_year'];
            return v ? this.psh_list[i].value + yearVal : null
          })
          .filter(v => v !== null);
        // console.log("selectedHeartSurgeryList", selectedPSHList);
        finalJsonInput["past_surgical_history"] = selectedPSHList;
      } else {
        finalJsonInput["past_surgical_history"] = [];
      }

      if (inputValues.otherSpecify) {
        //=== other value select ========
        finalJsonInput["others"] = inputValues.otherSpecifyVal === null ? "" : inputValues.otherSpecifyVal;
        finalJsonInput["since_year"] = inputValues.since_year;
      } else {
        finalJsonInput["others"] = "";
        finalJsonInput["since_year"] = "";
      }

    } else {
      finalJsonInput["heart_surgery"] = [];
      finalJsonInput["past_surgical_history"] = [];
      finalJsonInput["others"] = "";
    }
    // console.log(finalJsonInput);

    if (this.isEdit) {//====== While edit call Upadte REST API
      this.httpService.commonPost(appConstants.apiBaseUrl + 'update_medical_dashboard_summary', finalJsonInput).subscribe(data => {
        // console.log(data, "User Medical Summary Updated Successfully.");
        this.utilService.toastrSuccess(data.message, "Medical Summary");
        this.router.navigate([appConstants.routingList.HOME_COMPONENT]);
      },
        (err) => {
          console.log(err);
          this.utilService.toastrError(err.error.message.routine, "Medical Summary");
        });
    } else { //====== Create user Medical summary =====
      this.httpService.commonPost(appConstants.apiBaseUrl + 'create_medical_dashboard_summary', finalJsonInput).subscribe(data => {
        // console.log(data, "User Medical Summary Created Successfully.!.");
        this.utilService.toastrSuccess(data.message, "Medical Summary");
        this.router.navigate([appConstants.routingList.HOME_COMPONENT]);
      },
        (err) => {
          console.log(err);
          this.utilService.toastrError(err.error.message.routine, "Medical Summary");
        });
    }
  }
  setYearAndMimumLengthValidators() {
    console.log("setYearValidators");
    // const nil_yearControl = this.subscriberMedicalSummaryForm.get('nil_year');
    this.formArrayValidateMinimumLength('smh', 'smh_list');
    // this.formArrayValidateMinimumLength('psh','psh_list');
    this.formArrayValidateMinimumLength('heartSurgery', 'heartSurgery_list');
    this.formArrayValidateMinimumLength('durgAliergies', 'durgAliergies_list');
    this.formArrayValidateMinimumLength('currentMedication', 'currentMedication_list');

    this.formArayListYearValdator(this.getSMH(), 'smh_list');
    this.formArayListYearValdator(this.getPSH(), 'psh_list');
    this.formArayListYearValdator(this.getHeartSurgery(), 'heartSurgery_list');
    this.formArayListYearValdator(this.getDurgAliergies(), 'durgAliergies_list');
    this.formArayListYearValdator(this.getcurrentMedication(), 'currentMedication_list');

    this.subscriberMedicalSummaryForm.get('psh').valueChanges.subscribe(element_val => {
      this.pshValidation();
    });
    this.subscriberMedicalSummaryForm.get('heartSurgery').valueChanges.subscribe(element_val => {
      this.pshValidation();
    });
    this.subscriberMedicalSummaryForm.get('otherSpecify').valueChanges.subscribe(element_val => {
      this.pshValidation();
    });
  }

  private pshValidation() {
    let element_val = this.subscriberMedicalSummaryForm.get('psh').value;
    let psh_list = this.subscriberMedicalSummaryForm.get('psh_list');
    let heartSurgery = this.subscriberMedicalSummaryForm.get('heartSurgery').value;
    let otherSpecify = this.subscriberMedicalSummaryForm.get('otherSpecify').value;
    let otherYear = this.subscriberMedicalSummaryForm.get('since_year');
    let otherSpecifyVal = this.subscriberMedicalSummaryForm.get('otherSpecifyVal');
    if (element_val === 'Yes') {
      // if(_.contains(psh_list, true) ){
      if (heartSurgery || otherSpecify) {
        psh_list.setValidators(null);
      } else {
        psh_list.setValidators(this.minSelectedCheckboxes(1))
      }
      if (otherSpecify) {
        otherSpecifyVal.setValidators(Validators.required);
        otherYear.setValidators(Validators.required);
      } else {
        otherSpecifyVal.setValidators(null);
        otherYear.setValidators(null);
      }
    }
    else {
      psh_list.setValidators(null);
    }
    psh_list.updateValueAndValidity();
    otherSpecifyVal.updateValueAndValidity();
    otherYear.updateValueAndValidity();
  }

  private formArayListYearValdator(defaultList, controlListName) {
    this.subscriberMedicalSummaryForm.get(controlListName).valueChanges
      .subscribe(smh_changed_list => {
        defaultList.map((currElement, index) => {
          currElement["isSlected"] = smh_changed_list[index];
          let cuurent_controlElement = this.subscriberMedicalSummaryForm.get(currElement.value + '_year');
          if (smh_changed_list[index]) {
            cuurent_controlElement.setValidators([Validators.required]);
          }
          else {
            cuurent_controlElement.setValidators(null);
          }
          cuurent_controlElement.updateValueAndValidity();
        });
      });
  }

  private formArrayValidateMinimumLength(control, control_list) {
    this.subscriberMedicalSummaryForm.get(control).valueChanges.subscribe(element_val => {
      let cuurent_controlElement = this.subscriberMedicalSummaryForm.get(control_list);
      if (element_val === 'Yes' || element_val === true) {
        cuurent_controlElement.setValidators(this.minSelectedCheckboxes(1));
      }
      else {
        cuurent_controlElement.setValidators(null);
      }
      cuurent_controlElement.updateValueAndValidity();
    });
  }

  //===== Custom check box validator.
  minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);

      return totalSelected >= min ? null : { required: true };
    };
    return validator;
  }

  ngOnDestroy(): void {

  }

}
