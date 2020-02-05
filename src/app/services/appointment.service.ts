import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Apps from '../config/app.constants';
import * as moment from 'moment';


// import 'rxjs/Rx';
// import 'rxjs/add/operator/map';
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

    private apiUrlGetAppts = Apps.apiBaseUrl +'get_appointment_slots';
    private apiUrlDrApptSlot = Apps.apiBaseUrl +'create_appointment_slots';
    private apiUrlSubApptSlot = Apps.apiBaseUrl +'get_appointment_status';
    private apiUrlSubDropdownApptSlot = Apps.apiBaseUrl +'get_appointment_slots';
    private apiUrlSubApptCreate = Apps.apiBaseUrl +'create_appointment_status';
    private apiUrlSubApptCancel = Apps.apiBaseUrl +'cancel_appointment';
    private apiUrlSubApptReschedule = Apps.apiBaseUrl +'update_appointment_status';

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

  /*claimCreate(claimCreate): Observable<any> {
    
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

var todayDate = yyyy+'-'+mm+'-'+dd;

console.log(todayDate);
    let requestData: any = [];

    requestData = {};
    requestData = { 
         doctor_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,
         subscriber_id: claimCreate.patient,
         requested_date: todayDate
    };    
    console.log(requestData); 
    return this.http.post(this.apiUrlClaimCreate, requestData);
  }*/
/*  Doctor Appt Start */
  getGetAppts(): Observable<any> {
  
    let requestData = {};
    requestData = { 
         doctor_id: JSON.parse(sessionStorage.getItem("userdata")).user_id
   };    
    
    return this.http.post(this.apiUrlGetAppts, requestData);
  }

  createDrAppts(doctorApp): Observable<any> {
    var dd = String(doctorApp.date.getDate()).padStart(2, '0');
    var mm = String(doctorApp.date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = doctorApp.date.getFullYear();
    
    var dateFmt = yyyy+'-'+mm+'-'+dd;
    
    let requestData = {};
    requestData = { 
         doctor_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,
         date : dateFmt,
         time: doctorApp.time
   
        };    
   
    return this.http.post(this.apiUrlDrApptSlot, requestData);
  }
/*  Doctor Appt End */

/*  Subscriber Appt Start */

getSubAppts(): Observable<any> {
  
  let requestData = {};
  requestData = { 
       doctor_id: JSON.parse(sessionStorage.getItem("userdata")).doctor_id,
       user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id

 };    
  
  return this.http.post(this.apiUrlSubApptSlot, requestData);
}

getSubNewAppts(): Observable<any> {
  
  let requestData = {};
  requestData = { 
       doctor_id: JSON.parse(sessionStorage.getItem("userdata")).doctor_id,
       status: "New"
 };    
   
  return this.http.post(this.apiUrlSubDropdownApptSlot, requestData);
}

createApptStatus(data): Observable<any> {
  
  let dateFmt = moment(data.dateTime.appointement_date).utc().format('YYYY-MM-DD'); // 11/3/2019

  let requestData = {};
  requestData = {
      user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,
      doctor_id: JSON.parse(sessionStorage.getItem("userdata")).doctor_id,
      appointement_date: dateFmt,
      appointement_time: data.dateTime.appointement_time,
      appointement_status: "Requested" 
 };    
  
  return this.http.post(this.apiUrlSubApptCreate, requestData);
}

cancelApptStatus(data): Observable<any> {
  
  let dateFmt = moment(data.date).utc().format('YYYY-MM-DD'); // 11/3/2019

  let requestData = {};
  requestData = { 
    user_id: data.user_id,
    doctor_id: data.doctor_id,
    appointement_date: dateFmt,
    appointement_time: data.time,
    appointement_status: "Cancel"
 };
  
  return this.http.post(this.apiUrlSubApptCancel, requestData);
}

rescheduleApptStatus(data): Observable<any> {
  
  // console.log(moment(data.date).utc().format('YYYY-MM-DD')); // 11/3/2019
  let dateFmt = moment(data.date).utc().format('YYYY-MM-DD'); // 11/3/2019

  let requestData = {};
  requestData = { 
    user_id: data.user_id,
    doctor_id: data.doctor_id,
    appointement_date: dateFmt,
    appointement_time: data.time,
    appointement_status: "Reschedule"
 };    
   
  return this.http.post(this.apiUrlSubApptReschedule, requestData);
}

/*  Subscriber Appt End */
}
