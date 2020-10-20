import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { HttpService } from '../services/http.service';
import appConstants from '../config/app.constants';
import * as moment from 'moment';

@Component({
  selector: 'app-doctor-appointment',
  templateUrl: './doctor-appointment.component.html',
  styleUrls: ['./doctor-appointment.component.css']
})
export class DoctorAppointmentComponent implements OnInit {

  public doctorApp: FormGroup;
  minDate: Date;
  listViewUi: boolean = false;
  dataList:  any[] = [];
  showModal: boolean = false;
  apptDetails: boolean = false;
  doctorId: string = '';
  patientList: any[] = [];
  // doctorId: string = '';
  date: string = '';
  time: string = '';
  doctor: string = '';
  for: string = '';
  address: string = '';
  status: string = '';
  valueData: string = '';
  subName: string = '';
  deleteAppId: string = '';

  public statusArray = [
    {title: "Pending", id: "1"},
    {title: "Delete", id: "2"},
    {title: "Confirm", id: "3"},
    {title: "Reject", id: "4"},
    {title: "Cancel", id: "5"}
];

  constructor(private _fb: FormBuilder, private toastrService: ToastrService
    , private appointmentService: AppointmentService, private httpService: HttpService) 
    {
      this.minDate = new Date();
     }

  ngOnInit() {
    // this.doctorId = JSON.parse(sessionStorage.getItem("userdata")).user_id,
    this.getGetAppts();
    this.getLoginDrpatInfo();
    this.doctorApp = this._fb.group({
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      subscriber: ['', [Validators.required]]
  });

  }

  getLoginDrpatInfo(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getSubscriberList', { }).subscribe(patList => {
    
      this.patientList = patList.data;
      // console.log(this.patientList);
    });
  }

  getGetAppts(){
    this.dataList = [];
    /*this.appointmentService.getGetAppts().subscribe(disList => {
         this.dataList = disList['data'];   
    });*/
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getAppointmentByDoctor', { }).subscribe(patList => {
    
      this.dataList = patList.data;
      // console.log(this.dataList);
      // console.log(this.statusArray);
      for (var i = 0;  i < this.statusArray.length; i++) {
        for (var j = 0;  j < this.dataList.length; j++) {
          if (this.dataList[j].status == this.statusArray[i].id ) {
                 this.dataList[j]['statusName'] = this.statusArray[i].title;
                        }
        }
      }
      // console.log(this.dataList);
    });
  }

  openModal(){
      this.showModal = true;
      this.doctorApp.reset();
  }

  closeModal(){
    this.showModal = false;
}

  openOnRowModal(){
    this.apptDetails = true;
  }

  closeOnRowModal(){
    this.apptDetails = false;
  }

/*onSubmit( model: FormGroup ) {
  this.appointmentService.createDrAppts( model.value ).subscribe( response => {
      let message = 'Appointment Slot Created';
      this.toastrService.success(message);    
      this.closeModal(); 
      this.getGetAppts();             
  },
      error => {
        //   this.alertNotSuccess();  
      } );
  }*/

  onSubmit( model: FormGroup ) {
    // console.log(model.value);
    let appValues = model.value;
    appValues.date = moment(appValues.date).local().format("YYYY-MM-DD");                            
    // let app_date = moment(model.value.date).local().format('YYYY-MM-DD');
   
    // let app_time = moment(appValues.time).local().format('HH:mm');
    appValues.time = moment(appValues.time).local().format("HH:mm"); 
    // console.log(appValues);
    
    this.closeModal();
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'addAppointment', 
     {  date: [appValues.date],
        time: [appValues.time],
        sub_id: appValues.subscriber 
    }).subscribe(response => {
    
        // console.log(response);
        if(response.status == true){
          let message = 'The appointment has been created';
          this.toastrService.success(message);
         
          this.getGetAppts();
        } else{
          let message = 'Something Went Wrong';
          this.toastrService.error(message);
        }
      });
    }

    onRowSelect(event){
      //  console.log(event);
       this.openOnRowModal();
       this.date = '';
        this.time = '';
        this.doctor = '';
        this.for = '';
        this.address = '';
        this.status = '';

        this.deleteAppId = event.id;
        this.date = event.date;
        this.time = event.time;
        // this.doctor = value.doctor;
        this.for = event.quarter;
        this.subName = `${event.subscriber_name} (${event.sub_id})`;
        this.status = event.statusName;
       
    }

    deleteAppt(){
      // console.log(this.deleteAppId );
      this.closeOnRowModal();
      this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'deleteAppointment', { id: this.deleteAppId }).subscribe(response => {
    
        // console.log(response);
        if(response.status == true){
          let message = 'The appointment has been deleted';
          this.toastrService.success(message);
         
          this.getGetAppts();
        } else{
          let message = 'Something Went Wrong';
          this.toastrService.error(message);
        }
      });
    }
}
