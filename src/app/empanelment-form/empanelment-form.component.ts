import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { EmpanelmentService } from '../services/empanelment.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
// import appConstants from '../config/app.constants';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HttpService } from '../services/http.service';
import appConstants from '../config/app.constants'


@Component({
  selector: 'app-empanelment-form',
  templateUrl: './empanelment-form.component.html',
  styleUrls: ['./empanelment-form.component.css']
})
export class EmpanelmentFormComponent implements OnInit {

  @ViewChild('resumeRef', {static: false}) resumeRef:ElementRef;
  @ViewChild('academicRef', {static: false}) academicRef:ElementRef;
  @ViewChild('practicingCertificateRef', {static: false}) practicingCertificateRef:ElementRef;
  @ViewChild('insuranceRef', {static: false}) insuranceRef:ElementRef;


  specialisationList: any[] = [];
  public form: {
    first_name: string,
    last_name: string,
    gender: string,
    dob: string,
    national_id: string,
    year_of_registration: string,
    mma:  string,
    apc: string,  //Datepicker
    clinic_type: string,
    specialization: string,
    clinic: string,
    hospital_license_no: string,
    address_of_clinic_1: string,
    address_of_clinic_2: string,
    postcode: string,
    state: string,
    country: string,
    phone_no: string,
    mobile_no: string,
    email: string,
    resume: FileList | null,
    academic: FileList | null,
    practicingCertificate: FileList | null,
    insurance: FileList | null
  }

  public empanelmentForm: FormGroup;
  resData: any;
  filterClinicList = [];
  constructor(private formBuilder: FormBuilder, 
              private http:HttpClient, 
              private router: Router,
              private toastrService: ToastrService, 
              private empanelmentService: EmpanelmentService,
              private httpService: HttpService) { 

      this.form = {
        first_name: "",
        last_name: "",
        gender: "",
        dob: "",
        national_id: "",
        year_of_registration: "",
        mma:  "",
        apc: "",  //Datepicker
        clinic_type: "",
        specialization: "",
        clinic: "",
        hospital_license_no: "",
        address_of_clinic_1: "",
        address_of_clinic_2: "",
        postcode: "",
        state: "",
        country: "",
        phone_no: "",
        mobile_no: "",
        email: "",
        resume: null,
        academic: null,
        practicingCertificate: null,
        insurance: null
      };

    }

  ngOnInit() {
   this.getSpecialisationList();
   this.getDoctorProfileData();
   this.empanelmentService.getClinics().subscribe(disList => {
  // console.log(typeof(disList)); 
      // console.log(disList['data']);
        this.filterClinicList = [];         
        // let arr = Object.keys(disList).map((district) => disList[district])
      for (let i = 0; i < disList['data'].length ; i++) {
            this.filterClinicList.push({ label: disList['data'][i].clinic_type, value: disList['data'][i].clinic_type });
        }        
        
    });
  }


  changeClinicType(event){
    console.log(event);    
    if(event == 1){
      // document.getElementById("specialization").disabled = true;
      document.getElementById("specialization").setAttribute('disabled', 'disabled');
      this.form.specialization = '';
    } else {
        document.getElementById("specialization").removeAttribute('disabled');
    }
}

  onFileChangeCvs(sender){
    var validExts = new Array(".pdf", ".jpg", ".png");
    console.log(sender);
    
    var fileExt = sender.target.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      alert("Invalid file selected, valid files are of " +
               validExts.toString() + " types.");
               this.resumeRef.nativeElement.value = null;
      
      return false;
    }
    else 
    
    return true;

  }

  onFileChangeAcademicRef(sender){
    var validExts = new Array(".pdf", ".jpg", ".png");
    console.log(sender);
    
    var fileExt = sender.target.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      alert("Invalid file selected, valid files are of " +
               validExts.toString() + " types.");
               this.academicRef.nativeElement.value = null;
      return false;
    }
    else 
    return true;
  }

  onFileChangePracticingCertificateRef(sender){
    var validExts = new Array(".pdf", ".jpg", ".png");
    console.log(sender);
    
    var fileExt = sender.target.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      alert("Invalid file selected, valid files are of " +
               validExts.toString() + " types.");
               this.practicingCertificateRef.nativeElement.value = null;
      return false;
    }
    else 
    return true;
  }

  onFileChangeInsuranceRef(sender){
    var validExts = new Array(".pdf", ".jpg", ".png");
    console.log(sender);
    
    var fileExt = sender.target.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      alert("Invalid file selected, valid files are of " +
               validExts.toString() + " types.");
               this.insuranceRef.nativeElement.value = null;
      return false;
    }
    else 
    return true;
  }

  getSpecialisationList(){
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getSpecialisationList', { }).subscribe(response => {
    console.log(response.data);
    this.specialisationList = response.data;
  });
}

  getDoctorProfileData(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getMyAccount', { }).subscribe(docData => {
      console.log(docData.data);
      // this.patientList = patList.data;

      if(docData.data.clinic_type_desc == "Specialist"){
        // document.getElementById("specialization").setAttribute('disabled', 'disabled');
        document.getElementById("specialization").removeAttribute('disabled');
    } else {
        document.getElementById("specialization").setAttribute('disabled', 'disabled');
    }
       
    
      this.form = {
        first_name: docData.data.firstname,
        last_name: docData.data.lastname,
        gender: docData.data.gender == "Male" ? '1' : '2',
        dob: docData.data.dob,
        national_id: docData.data.nationality,
        year_of_registration: docData.data.reg_year,
        mma:  '',
        apc: docData.data.medical_reg_no,  //Datepicker
        clinic_type: docData.data.clinic_type,
        specialization: docData.data.specialisation,
        clinic: docData.data.provider,
        hospital_license_no: docData.data.provider_license_no,
        address_of_clinic_1: docData.data.address,
        address_of_clinic_2: docData.data.address2,
        postcode: docData.data.postcode,
        state: docData.data.state,
        country: docData.data.country,
        phone_no: docData.data.phone_no,
        mobile_no: docData.data.mobile,
        email: docData.data.email,
        resume: null,
        academic: null,
        practicingCertificate: null,
        insurance: null
      };
    });
  }
  /*getDoctorProfileData(){
    this.empanelmentService.getDoctorProfileData().subscribe(response => {
      // console.log(response.data[0]);
      this.form = {
        first_name: response.data[0].first_name,
        last_name: response.data[0].last_name,
        gender: response.data[0].gender,
        dob: response.data[0].dob,
        national_id: response.data[0].national_id,
        year_of_registration: response.data[0].year_of_registration,
        mma:  '',
        apc: response.data[0].apc_no,  //Datepicker
        clinic_type: response.data[0].clinic_type,
        specialization: response.data[0].specialization,
        clinic: response.data[0].hospital,
        hospital_license_no: '',
        address_of_clinic_1: response.data[0].address_of_clinic_1,
        address_of_clinic_2: response.data[0].address_2,
        postcode: response.data[0].postcode,
        state: response.data[0].state,
        country: response.data[0].country,
        phone_no: response.data[0].phone_no,
        mobile_no: response.data[0].mobile_no,
        email: JSON.parse(sessionStorage.getItem("userdata")).email,
        resume: null,
        academic: null,
        practicingCertificate: null,
        insurance: null
      };
    });
  }*/
  

public submitEmpanelment() : void {

  var first_name = this.form.first_name;
  var last_name = this.form.last_name;
  var gender = this.form.gender;
  var dob = this.form.dob;

  var national_id = this.form.national_id;
  var year_of_registration = this.form.year_of_registration;
  var mma = this.form.mma;
  var apc = this.form.apc;

  var clinic_type = this.form.clinic_type;
  var specialization = this.form.specialization;
  var clinic = this.form.clinic;
  var hospital_license_no = this.form.hospital_license_no;

  var address_of_clinic_1 = this.form.address_of_clinic_1;
  var address_of_clinic_2 = this.form.address_of_clinic_2;
  var postcode = this.form.postcode;
  var state = this.form.state;

  var country = this.form.country;
  var phone_no = this.form.phone_no;
  var mobile_no = this.form.mobile_no;
  var email = this.form.email;


  // Dealing with the files requires a tiny bit of elbow-grease. Since NgModel
  // won't automatically grab the files from the file-input, we have to use the
  // (changes) event to grab them manually. Then, we have to pluck the first
  // File Blob from the given FileList.
  var resume = (this.form.resume && this.form.resume.length)
  ? this.form.resume[0]
  : null;

var academic = (this.form.academic && this.form.academic.length)
  ? this.form.academic[0]
  : null;

  var practicingCertificate = (this.form.practicingCertificate && this.form.practicingCertificate.length)
  ? this.form.practicingCertificate[0]
  : null;
  var insurance = (this.form.insurance && this.form.insurance.length)
  ? this.form.insurance[0]
  : null;


  
   console.log(mobile_no);
   /*else if(specialization == '' || specialization == 'Specialist'){
    this.myAlert('Specialization:');
  } */
      if(first_name == ''){
        this.myAlert('First Name');
      } else if(last_name == ''){
        this.myAlert('Last Name');
      } else if(gender == ''){
        this.myAlert('Gender');
      } else if(dob == ''){
        this.myAlert('Date of birth');
      } else if(national_id == ''){
        this.myAlert('Nationality');
      } else if(mma == ''){
        this.myAlert('MMA No');
      }  else if(apc == ''){
        this.myAlert('APC No');
      }  else if(clinic_type == ''){
        this.myAlert('Clinic Type');
      }  else if(clinic == ''){
        this.myAlert('Name of Clinic');
      }  else if(hospital_license_no == ''){
        this.myAlert('Hospital License No');
      }else if(year_of_registration == ''){
        this.myAlert('Year of Registration');
      }
      else if(address_of_clinic_1 == ''){
        this.myAlert('Address Of Clinic');
      } else if(postcode == ''){
        this.myAlert('Postal code');
      }else if(state == ''){
        this.myAlert('State');
      } else if(country == ''){
        this.myAlert('Country');
      } else if(phone_no == ''){
        this.myAlert('Phone No');
      } else if(mobile_no == ''){
        this.myAlert('Mobile No');
      } else if(email == ''){
        this.myAlert('Email');
      } else if(resume == null){
        this.myAlert('CV');
      } else if(academic == null){
        this.myAlert('Academic and Medical Qualification');
      } else if(practicingCertificate == null){
        this.myAlert('Current Annual Practicing Certificate');
      } else if(insurance == null){
        this.myAlert('Current Idemnity Insurance');
      } else {
        
  this.empanelmentService
    .submitEmpanelment({
      first_name: first_name,
      last_name: last_name,
      gender: gender,
      dob: dob,
      national_id: national_id,
      year_of_registration: year_of_registration,
      mma:  mma,
      apc: apc,  //Datepicker
      clinic_type: clinic_type,
      specialization: specialization,
      clinic: clinic,
      hospital_license_no: hospital_license_no,
      address_of_clinic_1: address_of_clinic_1,
      address_of_clinic_2: address_of_clinic_2,
      postcode: postcode,
      state: state,
      country: country,
      phone_no: phone_no,
      mobile_no: mobile_no,
      email: email,
      resume: resume,
      academic: academic,
      practicingCertificate: practicingCertificate,
      insurance: insurance
    })
    .then(
      () => {

        let message = 'Empanelment Added Successully';
            this.toastrService.success(message);
            this.router.navigate(['home']);
      },
      ( error ) => {

        alert( "Something went wrong with the form-submission." );
        console.warn( "Error submitting empanelment." );
        console.error( error );

      });
    }

}

myAlert(message){
  let msg = 'Please provide '+ message;
  this.toastrService.error(msg);
}

}
