import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Apps from '../config/app.constants';
// import 'rxjs/Rx';
// import 'rxjs/add/operator/map';
import { Observable } from "rxjs";

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
    private apiUrlEmpanelment = Apps.apiBaseUrl +'Empanelement_Application';


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

  
  public getClinics(){
    return this.http.get(this.apiUrlClinic);
  }


  addEmpanelment(empanelmentForm): Observable<any> { 
    let requestData: any = [];
    requestData = {};
    requestData = [{    
            doctor_id:JSON.parse(sessionStorage.getItem("userdata")).user_id,   
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

		var formData = new FormData();

    formData.append( "doctor_id", JSON.parse(sessionStorage.getItem("userdata")).user_id );
		formData.append( "first_name", empanelment.first_name );
		formData.append( "last_name", empanelment.last_name );
    formData.append( "gender", empanelment.gender );    
    formData.append( "national_id", empanelment.national_id );
		formData.append( "date_of_birth", empanelment.dob );
    formData.append( "medical_registration_number", empanelment.mma );
    
    formData.append( "year_of_registration", empanelment.year_of_registration );
		formData.append( "clicnic_type", empanelment.clinic_type );
    formData.append( "specialization", empanelment.specialization );
    
    formData.append( "name_of_clinic", empanelment.clinic );
		formData.append( "hospital_license_no", empanelment.hospital_license_no );
    // formData.append( "year_of_registration2", empanelment.gender );
    
    formData.append( "address_of_clinic1", empanelment.address_of_clinic_1 );
		formData.append( "address2", empanelment.address_of_clinic_2 );
    formData.append( "postcode", empanelment.postcode );
    
    formData.append( "state", empanelment.state );
		formData.append( "country", empanelment.country );
    formData.append( "phone_no", empanelment.phone_no );
    
    formData.append( "mobile_no", empanelment.mobile_no );
		formData.append( "email_address", empanelment.email );
		formData.append( "status", '0' );

		( empanelment.resume ) && formData.append( "cvs", empanelment.resume );
		( empanelment.academic ) && formData.append( "academic_and_medical_qualifications", empanelment.academic );
    ( empanelment.practicingCertificate ) && formData.append( "current_annual_practising_certificate", empanelment.practicingCertificate );
		( empanelment.insurance ) && formData.append( "current_indemnity_insurence", empanelment.insurance );
    
		var result = await this.http
			.post<void>(
        this.apiUrlEmpanelment,
				formData
			
			)
			.toPromise()
		;

	}
  
  
}
