import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import Apps from '../config/app.constants';
// import 'rxjs/Rx';
// import 'rxjs/add/operator/map';
import { Observable } from "rxjs";
import * as moment from 'moment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const httpOptions = {
  // headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers':'X-Requested-With' }),
  headers: new HttpHeaders({ 
          'Content-Type': 'application/json; application/x-www-form-urlencoded; charset=utf-8', 
          'Access-Control-Allow-Origin': '*', 
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 
          'Access-Control-Allow-Credentials':'true','Access-Control-Allow-Headers':'X-PINGOTHER,Content-Type,X-Requested-With,accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization','Access-Control-Expose-Headers':'xsrf-token' }),
          params: new HttpParams({})
};

interface AddEmpanelment {
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
    resume: File | null,
    academic: File | null,
    practicingCertificate:File | null,
    insurance: File | null
}

@Injectable({
  providedIn: 'root'
})
export class EmpanelmentService {
    
    private apiUrlClinic = Apps.apiBaseUrl +'Get_Clicnic_type';    
    private apiUrlEmpanelment = Apps.apiBaseUrl +'updateMyAccount';
    private apiGetProfileData = Apps.apiBaseUrl +'get_doctor_details';

  post(arg0: string, arg1: string) {
    throw new Error("Method not implemented.");
  }
  
  headers= new HttpHeaders({ 
    'Content-Type': 'application/json; charset=utf-8 '
  });
  options = { headers: this.headers };
 
  
  commonPost(url, body): Observable<any> {
    return this.http.post(url,
      body, this.options);
  }
  
  constructor(private http:HttpClient,
     ) { }

     getDoctorProfileData(): Observable<any> {
      let requestData: any = [];
      requestData = {};
      requestData = {
          user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id
      };
      return this.http.post(this.apiGetProfileData, requestData);
    }

  
  public getClinics(){
    return this.http.get(this.apiUrlClinic);
  }


  addEmpanelment(empanelmentForm): Observable<any> { 

    let requestData: any = [];
    requestData = {};
    requestData = [{    
            doctor_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,   
            first_name: empanelmentForm.first_name,
            last_name: empanelmentForm.last_name,
            national_id: empanelmentForm.national_id,
            date_of_birth: empanelmentForm.dob,
            gender: empanelmentForm.gender,  
            medical_registration_number: empanelmentForm.mma,
            apc_no: empanelmentForm.year_of_registration,
            clinic_type: empanelmentForm.clinic_type,
            specialization: empanelmentForm.specialization,
            name_of_clinic: empanelmentForm.clinic,  
            hospital_licence_no: empanelmentForm.hospital_license_no,
            year_of_registration2: empanelmentForm.apc,
            address_of_clinic1: empanelmentForm.address_of_clinic_1,
            address2: empanelmentForm.address_of_clinic_2,
            postcode: empanelmentForm.postcode,
            state: empanelmentForm.state,
            country: empanelmentForm.country,
            phone_no: empanelmentForm.phone_no,
            mobile_no: empanelmentForm.mobile_no,
            email_address: empanelmentForm.email,
            cvs:'',
            academic_and_medical_qualifications:'',
            current_annual_practising_certificate:'',
            current_indemnity_insurence:'',
            status: 0
            
    }];    
    console.log(requestData); 
    return this.http.post(this.apiUrlEmpanelment, requestData);
  }

  /*public async submitEmpanelment( empanelment: AddEmpanelment ) : Promise<void> {

  }*/

  public async submitEmpanelment( empanelment: AddEmpanelment ) : Promise<void> {
console.log(empanelment);

		var formData = new FormData();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'my-auth-token',
        'AUTHENTICATE': sessionStorage.getItem("token"),
      })
    };
    // formData.append( "doctor_id", JSON.parse(sessionStorage.getItem("userdata")).user_id );
		formData.append( "firstname", empanelment.first_name );
		formData.append( "lastname", empanelment.last_name );
    formData.append( "gender", empanelment.gender );    
    formData.append( "nationality", empanelment.national_id );
		formData.append( "dob", moment(empanelment.dob).format('YYYY-MM-DD')); 
    formData.append( "medical_reg_no", empanelment.mma );
    formData.append( "apc_no", empanelment.apc );
    formData.append( "reg_year", moment(empanelment.year_of_registration).format('YYYY-MM-DD') );
		formData.append( "clinic_type", empanelment.clinic_type );
    formData.append( "specialisation", empanelment.specialization );
    
    formData.append( "provider", empanelment.clinic );
		formData.append( "provider_license_no", empanelment.hospital_license_no );
    
    formData.append( "address", empanelment.address_of_clinic_1 );
		formData.append( "address2", empanelment.address_of_clinic_2 );
    formData.append( "postcode", empanelment.postcode );
    
    formData.append( "state", empanelment.state );
		formData.append( "country", empanelment.country );
    formData.append( "phone_no", empanelment.phone_no );
    
    formData.append( "mobile", empanelment.mobile_no );
		formData.append( "email", empanelment.email );
		formData.append( "is_empanelment", '1' );

		( empanelment.resume ) && formData.append( "cv", empanelment.resume );
		( empanelment.academic ) && formData.append( "qualification", empanelment.academic );
    ( empanelment.practicingCertificate ) && formData.append( "cert", empanelment.practicingCertificate );
		( empanelment.insurance ) && formData.append( "insurance", empanelment.insurance );
    
		var result = await this.http
			.post<void>(
        this.apiUrlEmpanelment,
				formData,
        httpOptions
			)
			.toPromise()
		;

	}
  
  
}
