import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn, Validators } from "@angular/forms";
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { DataService } from "../../services/data.service";
import { formatDate } from '@angular/common';
import { AuthService } from '../../auth.service';
import appConstants from '../../config/app.constants';
import { UtilService } from '../../services/util.service';
import * as moment from 'moment';

@Component({
  selector: 'app-subscriber-profile',
  templateUrl: './subscriber-profile.component.html',
  styleUrls: ['./subscriber-profile.component.css']
})
export class SubscriberProfileComponent implements OnInit {
  
  constructor(private httpService: HttpService, private data: DataService, private formBuilder: FormBuilder, public auth: AuthService, private router: Router, private utilService: UtilService) { }
  subscriberProfileForm;
  submitted = false;
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileData;
  //nationalityList: string[] = ["Indian", "Hindu", "Muslim", "Christian"];
  //countryList: string[] = ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"];
  //countryList: string[] = ["Afghanistan", "USA", "China", "UK", "India"];
  //stateList: string[] = ["Andhrapradesh", "Telangana", "Tamilnadu", "Kerila", "Karnataka"];
  raceList: string[] = ["AA_Women", "AH_Women", "AA_Men", "WH_Men"];
  
  ngOnInit() {
    if (this.auth.isSubscriber()) {//====== if Subascriber Take user_id from session.=====
      this.user_id = JSON.parse(sessionStorage.getItem('userdata')).user_id;
    } else if(this.auth.isCorporate()){
      this.user_id = JSON.parse(sessionStorage.getItem('userdata')).user_id;
    }
    this.firstName = JSON.parse(sessionStorage.getItem('userdata')).firstname;
    this.lastName = JSON.parse(sessionStorage.getItem('userdata')).lastname;
    this.email = JSON.parse(sessionStorage.getItem('userdata')).email;

    const subscriberDetails = JSON.parse(sessionStorage.getItem('userdata'));

    this.subscriberProfileForm = this.formBuilder.group({
      first_name: [subscriberDetails.first_name, [Validators.required]],
      last_name: [subscriberDetails.last_name, [Validators.required]],
      email_user_id: ["", [Validators.required]],
      dob: ["", [Validators.required]],
      national_id: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      address: ["", [Validators.required]],
      address_2: ["", [Validators.required]],
      postcode: ["", [Validators.required]],
      state: ["", [Validators.required]],
      country: ["", [Validators.required]],
      mobile_no: ["", [Validators.required]],
      phone_no: ["", [Validators.required]],
      fax_no: ["", [Validators.required]],
      user_id: ["", [Validators.required]],
      height: ["", [Validators.required]],
      mrn: ["", [Validators.required]],
      race: ["", [Validators.required]],
      treatement_for_high_blood_pressure: ["", [Validators.required]],
      diabetes: ["", [Validators.required]],
      smoker: ["", [Validators.required]],
      doctor_id: ["", [Validators.required]]
    });

    this.profileFormReport();
  
  }

  get f() {
    return this.subscriberProfileForm.controls;
  }

  profileFormReport(){
    this.httpService.commonPost(appConstants.apiBaseUrl + 'get_subscriber_details', { user_id: this.user_id }).
    subscribe((data) => {
      this.profileData = data.data[0];
      console.log(this.profileData);
      // console.log(new Date(this.profileData.dob).toDateString());
      if (data.status) {
        if (data.data[0] !== undefined) {
          //pathch values from subscriberProfileForm
          this.subscriberProfileForm.patchValue({
            first_name: this.profileData.first_name,
            last_name: this.profileData.last_name,
            email_user_id: this.profileData.email_user_id,
            gender: this.profileData.gender,
            dob: formatDate(this.profileData.dob, 'dd-MM-yyyy', 'en'),
            national_id: this.profileData.national_id,
            address: this.profileData.address,
            address_2: this.profileData.address_2,
            postcode: this.profileData.postcode,
            state: this.profileData.state,
            country: this.profileData.country,
            mobile_no: this.profileData.mobile_no,
            phone_no: this.profileData.phone_no,
            fax_no: this.profileData.fax_no,
            user_id: this.profileData.user_id ? this.profileData.user_id : this.user_id,
            height: this.profileData.height,
            mrn: this.profileData.mrn,
            race: this.profileData.race,
            treatement_for_high_blood_pressure: this.profileData.treatement_for_high_blood_pressure,
            diabetes: this.profileData.diabetes,
            smoker: this.profileData.smoker,
            doctor_id: this.profileData.doctor_id,
          });
        }else if(data.data.length === 0){
          this.subscriberProfileForm.patchValue({
             user_id: this.user_id,
             first_name: this.firstName,
             last_name: this.lastName,
             email_user_id: this.email
          });
        }
      }
    });
    
  }

  onSubmit(){
    this.submitted = true;
    let profileValues = this.subscriberProfileForm.value;
    profileValues["user_id"] = this.user_id;
    profileValues.dob= moment(profileValues.dob, "DD-MM-YYYY").format("YYYY-MM-DD");
    
    profileValues.mobile_no = "+60 "+profileValues.mobile_no;
    // console.log(profileValues);
    this.httpService.commonPost(appConstants.apiBaseUrl + 'update_subscriber_details', profileValues).subscribe(data => {
        this.utilService.toastrSuccess("Details Updated Sucessfully", "Profile Data Updated Sucessfully");
      }, (err) => {
        console.log(err);
        this.utilService.toastrError("Profile Data Updated Failed !.("+err.error.message.routine+")", "Progress Report");
      });
    
    } 

    
  
}
