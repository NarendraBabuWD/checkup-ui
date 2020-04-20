import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { DataService } from "../../services/data.service";
import { formatDate } from '@angular/common';
import { AuthService } from '../../auth.service';
import appConstants from '../../config/app.constants';
import { UtilService } from '../../services/util.service';
import { InviteSubscriberService } from "../../services/inviteSuscriber.service";
import * as moment from 'moment';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {

  constructor(private httpService: HttpService, 
              private data: DataService, 
              private formBuilder: FormBuilder, 
              public auth: AuthService, 
              private router: Router, private inviteSubscriberService: InviteSubscriberService, 
              private utilService: UtilService) { }

  doctorProfileForm;
  submitted = false;
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileData;
  isViewOnly = false;
  // nationalIdList: number[] = [1, 2, 3, 4, 5];
  //nationalIdList: string[] = ["Indian", "Hindu", "Muslim", "Christian"];
  //countryList: string[] = ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"];
  //countryList: string[] = ["Afghanistan", "USA", "China", "UK", "India"];
  //stateList: string[] = ["Andhra Pradesh", "Telangana", "Tamilanadu", "Kerala", "Karnataka"];

  ngOnInit() {
    // if (this.auth.isSubscriber()) {//====== if Subascriber Take user_id from session.=====
      this.user_id = JSON.parse(sessionStorage.getItem('userdata')).user_id;
      const doctorDetails = JSON.parse(sessionStorage.getItem('userdata'));
      // console.log(this.user_id);
    // } else if (this.auth.isDoctor()) {
    //   this.data.getSubscriberId.subscribe(subscriber_id => this.user_id = subscriber_id);
    // }
    this.firstName = JSON.parse(sessionStorage.getItem('userdata')).firstname;
    this.lastName = JSON.parse(sessionStorage.getItem('userdata')).lastname;
    this.email = JSON.parse(sessionStorage.getItem('userdata')).email;

    this.doctorProfileForm = this.formBuilder.group({
      firstname: [doctorDetails.first_name, [Validators.required]],
      lastname: [doctorDetails.last_name, [Validators.required]],
      gender: ["", [Validators.required]],
      email: ["", [Validators.required]],
      dob: ["", [Validators.required]],
      nationality: ["", [Validators.required]],
      reg_year: ["", [Validators.required]],
      clinic_type: ["", [Validators.required]],
      specialisation: ["", [Validators.required]],
      provider: ["", [Validators.required]],
      provider_license_no: ["", [Validators.required]],
      address: ["", [Validators.required]],
      address2: ["", [Validators.required]],
      postcode: ["", [Validators.required]],
      state: ["", [Validators.required]],
      country: ["", [Validators.required]],
      mobile: ["", [Validators.required]],
      medical_reg_no: ["", [Validators.required]],
      mrn: null,
      user_id: ["", [Validators.required]],
    });

    this.profileFormReport();

  }

  get f() {
    return this.doctorProfileForm.controls;
  }


  profileFormReport() {
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getMyAccount', { }).
      subscribe((data) => {
        this.profileData = data.data;
        console.log(this.profileData);
        
            //pathch values from DoctorProfileForm
            this.doctorProfileForm.patchValue({
              user_id: this.profileData.id,
              firstname: this.profileData.firstname,
              lastname: this.profileData.lastname,
              gender: this.profileData.gender,
              email: this.profileData.email,
              dob: this.profileData.dob,
              nationality: this.profileData.nationality,
              reg_year: this.profileData.reg_year,
              clinic_type: this.profileData.clinic_type,
              specialisation: this.profileData.clinic_type_desc,
              medical_reg_no: this.profileData.medical_reg_no,
               
              provider: this.profileData.provider,
              provider_license_no: this.profileData.provider_license_no,
              // hospital_license_no: this.profileData.hospital_license_no,
              address: this.profileData.address,
              address2: this.profileData.address2,
              postcode: this.profileData.postcode,
              state: this.profileData.state,
              country: this.profileData.country,
              mobile: this.profileData.mobile,
              // phone_no: this.profileData.phone_no,
              // mrn: this.profileData.mrn,
            });
          
        
      });

  }


  /*profileFormReport() {
    this.httpService.commonPost(appConstants.apiBaseUrl + 'get_doctor_details', { user_id: this.user_id }).
      subscribe((data) => {
        this.profileData = data.data[0];
        // console.log(this.profileData);
        // console.log(new Date(this.profileData.dob).toDateString());
        if (data.status) {
          if (data.data[0] !== undefined) {
            //pathch values from DoctorProfileForm
            this.doctorProfileForm.patchValue({
              first_name: this.profileData.first_name,
              last_name: this.profileData.last_name,
              gender: this.profileData.gender,
              dob: formatDate(this.profileData.dob, 'dd-MM-yyyy', 'en'),
              national_id: this.profileData.national_id,
              year_of_registration: formatDate(this.profileData.year_of_registration, 'dd-MM-yyyy', 'en'),
              clinic_type: this.profileData.clinic_type,
              specialization: this.profileData.specialization,
              hospital: this.profileData.hospital,
              hospital_license_no: this.profileData.hospital_license_no,
              address_of_clinic_1: this.profileData.address_of_clinic_1,
              address_2: this.profileData.address_2,
              postcode: this.profileData.postcode,
              state: this.profileData.state,
              country: this.profileData.country,
              mobile_no: this.profileData.mobile_no,
              phone_no: this.profileData.phone_no,
              // mrn: this.profileData.mrn,
              user_id: this.profileData.user_id
            });
          }else if(data.data.length === 0){
            this.doctorProfileForm.patchValue({
              user_id: this.user_id,
              first_name: this.firstName,
              last_name: this.lastName,
              email_user_id: this.email
            });
          }
        }
      });

  }*/


  onSubmit() {
    this.submitted = true;
    // console.log(this.doctorProfileForm.value);
    let profileValues = this.doctorProfileForm.value;
    profileValues["user_id"] = this.user_id;
    profileValues["is_empanelment"] = "0";
     profileValues.dob = moment(profileValues.dob, "DD-MM-YYYY").format('YYYY-MM-DD');     
    //  profileValues.year_of_registration = moment(profileValues.year_of_registration, "DD-MM-YYYY").format('YYYY-MM-DD');
     console.log(profileValues);
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'updateMyAccount', profileValues).subscribe(data => {
      this.utilService.toastrSuccess(data.message, "Profile Data Updated Sucessfully");
      this.router.navigate(['home']);
    // this.checkEmpanelment();
    }, (err) => {
      console.log(err);
      this.utilService.toastrError("Profile Data Updated Failed !.(" + err.error.message.routine + ")", "Profile Data");
    });
    
  }


  checkEmpanelment(){
    this.inviteSubscriberService.getEmpanelementStatus().subscribe(response => {
      if(response['data'].length > 0){
       this.router.navigate(['home']);
      } else{
       this.router.navigate(['empanelment-form']);
      }
   
     });
  }
}
