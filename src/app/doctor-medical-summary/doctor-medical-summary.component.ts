import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { HttpService } from '../services/http.service';
import appConstants from '../config/app.constants'
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-doctor-medical-summary',
  templateUrl: './doctor-medical-summary.component.html',
  styleUrls: ['./doctor-medical-summary.component.css']
})
export class DoctorMedicalSummaryComponent implements OnInit {

  patientList: any[] = [];

  selectedSignificant: string;
  selectedSignificantSince: string;
  selectedPast: string;
  selectedPastSince: string;
  selectedDA: string;
  selectedDASince: string;
  selectedCA: string;
  selectedCASince: string;
  raceList: string[] = ["Chinese", "Indian", "Malay"];
  created: string;
  first_name: string;
  last_name: string;
  mrn: string;
  dob: string;
  age: string;
  id: string;
  gender: string;
  smhList: any[] = [];
  pshList: any[] = [];
  daList: any[] = [];
  cmList: any[] = [];

  significantList: any[] = [];
  pastSurgicalList: any [] = [];
  medicationList: any [] = [];
  drugAllergyList: any [] = [];
  sigdisplay = 'none';
  pastdisplay = 'none';
  cmdisplay = 'none';
  dadisplay = 'none';
  constructor(private router: Router, private httpService: HttpService,
              private activatedRoute: ActivatedRoute, private utilService: UtilService,
              private formBuilder: FormBuilder) { }

   medicalSummarySigInputForm: FormGroup;
   medicalSummaryPastInputForm: FormGroup;
   medicalSummaryCMInputForm: FormGroup;
   medicalSummaryDAInputForm: FormGroup;
   treatmentFor: FormGroup;

  ngOnInit() {

    this.treatmentFor = this.formBuilder.group({
      race: ['', [Validators.required]],
      hbp: ['', [Validators.required]],
      diabetes: ['', [Validators.required]],
      smoker: ['', [Validators.required]]
    });

    this.medicalSummarySigInputForm = this.formBuilder.group({
      selectedSigVal: ['', [Validators.required]],
      since: ['', [Validators.required]]
    });

    this.medicalSummaryPastInputForm = this.formBuilder.group({
      selectedVal: ['', [Validators.required]],
      since: ['', [Validators.required]]
    });

    this.medicalSummaryCMInputForm = this.formBuilder.group({
      selectedVal: ['', [Validators.required]],
      since: ['', [Validators.required]]
    });

    this.medicalSummaryDAInputForm = this.formBuilder.group({
      selectedVal: ['', [Validators.required]],
      since: ['', [Validators.required]]
    });

    this.getSelectedPtientData();
    // console.log(this.activatedRoute.snapshot.url[1].path);
    this.getSignificantMedicalHistoryList(); 
    this.gePastSurgicalHistoryList();
    this.getMedicationList();
    this.getDrugAllergyList();
    
  }

  openSigModal(){
    this.sigdisplay='block';
    this.medicalSummarySigInputForm.reset();
 }

onCloseSigHandled(){
    this.sigdisplay='none';
    this.medicalSummarySigInputForm.reset();
 }


 openPastModal(){
  this.pastdisplay='block';
}

onClosePastHandled(){
  this.pastdisplay='none';
}

openCMModal(){
  this.cmdisplay='block';
}

onCloseCMHandled(){
  this.cmdisplay='none';
}

openDAModal(){
  this.dadisplay='block';
}

onCloseDAHandled(){
  this.dadisplay='none';
}
  getSelectedPtientData(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getMyMedicalSummary', 
    { sub_id: this.activatedRoute.snapshot.url[1].path}).subscribe(subData => {
      // console.log(subData.data); 
      
      this.created = subData.data.created;
      this.first_name =  subData.data.firstname;
      this.last_name =  subData.data.lastname;
      this.mrn = subData.data.mrn;
      this.dob = subData.data.dob;
      this.age = subData.data.age;
      this.id = subData.data.user_id;
      this.gender = subData.data.gender;
      this.smhList = subData.data.smh_data;
      this.pshList = subData.data.psh_data;
      this.daList = subData.data.da_data;
      this.cmList = subData.data.cm_data;
      this.treatmentFor.controls['race'].patchValue(subData.data.race);
      this.treatmentFor.controls['hbp'].patchValue(subData.data.hbp);
      this.treatmentFor.controls['diabetes'].patchValue(subData.data.diabetes);
      this.treatmentFor.controls['smoker'].patchValue(subData.data.smoker);
    });
  }


  getSignificantMedicalHistoryList(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getSignificantMedicalHistoryList', { }).subscribe(significantList => {
      // console.log(significantList.data);
      this.significantList = significantList.data;
    });
  }

  gePastSurgicalHistoryList(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'gePastSurgicalHistoryList', { }).subscribe(pastSurgicalList => {
      // console.log(pastSurgicalList.data);
      this.pastSurgicalList = pastSurgicalList.data;

    });
  }

  getMedicationList(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getMedicationList', { }).subscribe(medicationList => {
      // console.log(medicationList.data);
      this.medicationList = medicationList.data;
    });
  }

  getDrugAllergyList(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getDrugAllergyList', { }).subscribe(drugAllergyList => {
      // console.log(drugAllergyList.data);
      this.drugAllergyList = drugAllergyList.data;
    });
  }


  sigOnSubmit(){
    // console.log(this.medicalSummarySigInputForm.value);
    this.selectedSignificant = "";
       this.selectedSignificantSince = "";
     let selectedSignificantName = this.significantList.find(s => s.id == this.medicalSummarySigInputForm.value.selectedSigVal);
      
     this.selectedSignificant = selectedSignificantName.desc;
       this.selectedSignificantSince = "Since "+this.medicalSummarySigInputForm.value.since;
      
       this.smhList.push({name:selectedSignificantName.desc, since:this.medicalSummarySigInputForm.value.since})

       this.onCloseSigHandled();
  }

  removeSmhList(itemName){
    
    this.smhList = this.smhList.filter((item) => item.name !== itemName);
    
  }
  pastOnSubmit(){
   
    let selectedPastName = this.pastSurgicalList.find(s => s.id == this.medicalSummaryPastInputForm.value.selectedVal);
    
    this.pshList.push({name:selectedPastName.desc, since:this.medicalSummaryPastInputForm.value.since})
       this.selectedPast = selectedPastName.desc;
       this.selectedPastSince = "Since "+this.medicalSummaryPastInputForm.value.since;
       this.onClosePastHandled();
  }

  removePshList(itemName){

    this.pshList = this.pshList.filter((item) => item.name !== itemName);
  }

  cmOnSubmit(){
    
    let selectedPCMName = this.medicationList.find(s => s.id == this.medicalSummaryCMInputForm.value.selectedVal);
    
    this.cmList.push({name:selectedPCMName.name, since:this.medicalSummaryCMInputForm.value.since})
       this.selectedCA = selectedPCMName.name;
       this.selectedCASince = "Since "+this.medicalSummaryCMInputForm.value.since;
       this.onCloseCMHandled();

  }

  removeCmList(itemName){
    this.cmList = this.cmList.filter((item) => item.name !== itemName);
  }

  daOnSubmit(){
    
    let selectedPCMName = this.drugAllergyList.find(s => s.id == this.medicalSummaryDAInputForm.value.selectedVal);
    
    this.daList.push({name:selectedPCMName.name, since:this.medicalSummaryDAInputForm.value.since})
       this.selectedDA = selectedPCMName.name;
       this.selectedDASince = "Since "+this.medicalSummaryDAInputForm.value.since;
       this.onCloseDAHandled();
  
  }

  removeDaList(itemName){

    this.daList = this.daList.filter((item) => item.name !== itemName);
  }
  

  mainSubmit(){
    let smh_item = {};
    let smh_since = {};
    let psh_item = {};
    let psh_since = {};
    let cm_item = {};
    let cm_since = {};
    let da_item = {};
    let da_since = {};
      for(let i = 0; i <= this.significantList.length - 1; i++){
           for(let j = 0; j <= this.smhList.length - 1; j++){

              if(this.significantList[i].desc == this.smhList[j].name){
                smh_item[this.significantList[i].id] = this.significantList[i].desc;
                smh_since[this.significantList[i].id] = this.smhList[j].since;
              }    
      }
    
  }
  
  
  for(let i = 0; i <= this.pastSurgicalList.length - 1; i++){
    for(let j = 0; j <= this.pshList.length - 1; j++){

       if(this.pastSurgicalList[i].desc == this.pshList[j].name){
        psh_item[this.pastSurgicalList[i].id] = this.pastSurgicalList[i].desc;
        psh_since[this.pastSurgicalList[i].id] = this.pshList[j].since;
       }    
}

}

  for(let i = 0; i <= this.medicationList.length - 1; i++){
    for(let j = 0; j <= this.cmList.length - 1; j++){

       if(this.medicationList[i].name == this.cmList[j].name){
        cm_item[this.medicationList[i].id] = this.medicationList[i].name;
        cm_since[this.medicationList[i].id] = this.cmList[j].since;
       }    
}

}

  for(let i = 0; i <= this.drugAllergyList.length - 1; i++){
    for(let j = 0; j <= this.daList.length - 1; j++){

       if(this.drugAllergyList[i].name == this.daList[j].name){
        da_item[this.drugAllergyList[i].id] = this.drugAllergyList[i].name;
        da_since[this.drugAllergyList[i].id] = this.daList[j].since;
       }    
}

}
/*
console.log(smh_item);
  console.log(smh_since);
    console.log(psh_item);
      console.log(psh_since);
        console.log(cm_item);
          console.log(cm_since);
    
console.log(da_item);
console.log(da_since);*/
this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'updateMedicalSummary', 
{
    sub_id: this.activatedRoute.snapshot.url[1].path,
    smh_item: smh_item,
    smh_since: smh_since,
    psh_item: psh_item,
    psh_since: psh_since,
    cm_item: cm_item,
    cm_since: cm_since,
    da_item: da_item,
    da_since: da_since,
    race: this.treatmentFor.controls['race'].value,
    hbp: this.treatmentFor.controls['hbp'].value,
    diabetes: this.treatmentFor.controls['diabetes'].value,
    smoker: this.treatmentFor.controls['smoker'].value
}).subscribe(data => {
  this.utilService.toastrSuccess("Medical Summary Updated Sucessfully", "Data Updated Sucessfully");
  this.router.navigate(['home']);
}, (err) => {
  console.log(err);
  this.utilService.toastrError("Medical Summary Updated Failed !.("+err.error.message.routine+")", "Not Updated Sucessfully");
});
}

}
