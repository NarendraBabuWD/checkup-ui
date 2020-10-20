import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { HttpService } from '../services/http.service';
import appConstants from '../config/app.constants';
import * as moment from 'moment';

@Component({
  selector: 'app-subscriber-appointment',
  templateUrl: './subscriber-appointment.component.html',
  styleUrls: ['./subscriber-appointment.component.css']
})
export class SubscriberAppointmentComponent implements OnInit {
  public subAppNew: FormGroup;
  listViewUi: boolean = false;
  dataList:  any[] = [];
  appList: any[] = [];
  showModal: boolean = false;
  apptDetails: boolean = false;
  confirmAppBtn: boolean = false;
  rescheduleAppBtn: boolean = false;
  cancelAppBtn: boolean = false;
  doctorId: string = '';
  date: string = '';
  time: string = '';
  doctor: string = '';
  for: string = '';
  address: string = '';
  status: string = '';
  valueData: string = '';
  postcode: string = '';
  state: string = '';
  country: string = '';

  public statusArray = [
    {title: "Pending", id: "1"},
    {title: "Delete", id: "2"},
    {title: "Confirm", id: "3"},
    {title: "Reject", id: "4"},
    {title: "Cancel", id: "5"}
];

  constructor(private _fb: FormBuilder, private toastrService: ToastrService
    , private appointmentService: AppointmentService, private httpService: HttpService) { }

  ngOnInit() {
    // this.getSubNewAppts();
    this.getSubAppts();
    this.subAppNew = this._fb.group({
      dateTime: ['', [Validators.required]]
  });
  }

  onSubmit( model: FormGroup ) {
    this.appointmentService.createApptStatus( model.value ).subscribe( response => {
      
        this.toastrService.success(response.message);    
        this.showModal = false;
        this.getSubAppts();

    },
        error => {
          //   this.alertNotSuccess();
            
        } );

} 

  /*getSubNewAppts(){
    this.dataList = [];
    this.appointmentService.getSubNewAppts().subscribe(disList => {
      
         this.dataList = disList['data']; 
        
    });
  }*/

  /*getSubAppts(){
    this.appList = [];
    this.appointmentService.getSubAppts().subscribe(disList => {
         this.appList = disList['data']; 
    });
  }*/

  getSubAppts(){
    this.appList = [];
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getAppointmentBySubscriber', { }).subscribe(response => {
      this.appList = response['data']; 
      // console.log(this.appList);

      // console.log(this.statusArray);
      for (var i = 0;  i < this.statusArray.length; i++) {
        for (var j = 0;  j < this.appList.length; j++) {
          if (this.appList[j].status == this.statusArray[i].id ) {
                 this.appList[j]['statusName'] = this.statusArray[i].title;
                        }
        }
      }
      // console.log(this.appList);
    });
  }

  openModal(){
    this.showModal = true;
    this.subAppNew.reset();
}
closeModal(){
  this.showModal = false;
}
apptDetailsCloseModal(){
  this.apptDetails = false;
}
onRowSelect(value){
  this.valueData = value.id;
//  console.log(value);
  this.apptDetails = true;
  this.date = '';
  this.time = '';
  this.doctor = '';
  this.for = '';
  this.address = '';
  this.status = '';

  this.date = value.date;
  this.time = value.time;
  this.doctor = value.doctor_name;
  this.for = value.quarter;
  this.address =  `${value.address}, ${value.address2}`;
  this.postcode = value.postcode;
  this.state = value.state;
  this.country = value.country;
  this.status = value.statusName;

  if(value.statusName == "Pending"){
    this.confirmAppBtn = true;
    this.rescheduleAppBtn = true;
    this.cancelAppBtn = false;
  } else{
    this.confirmAppBtn = false;
    this.rescheduleAppBtn = false;
    this.cancelAppBtn = true;
  }
}
reschedule(){
  console.log(this.valueData);
  this.apptDetailsCloseModal();
  /*this.appointmentService.rescheduleApptStatus(this.valueData).subscribe(response => {
    // console.log(response);
     
   let message = 'Appointement Successfully Rescheduled';
      this.toastrService.success(message);     
      this.apptDetailsCloseModal(); 
      this.getSubAppts();     
  });*/
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'rejectAppointment', { id: this.valueData }).subscribe(response => {
    
    console.log(response);
    if(response.status == true){
     
      let message = 'Appointement Successfully Rescheduled';
      this.toastrService.success(message);
      this.getSubAppts();
    } else{
      let message = 'Something Went Wrong';
      this.toastrService.error(message);
    }
  });
}

cancelStatus(){
  // console.log(this.valueData);
   this.apptDetailsCloseModal();
  /*this.appointmentService.cancelApptStatus(this.valueData).subscribe(response => {
   
      this.toastrService.success(response.message);     
      this.apptDetailsCloseModal(); 
      this.getSubAppts();     
  });*/
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'cancelAppointment', { id: this.valueData }).subscribe(response => {
    
    // console.log(response);
    if(response.status == true){
     
      let message = 'Appointement Successfully Cancelled';
      this.toastrService.success(message);
      this.getSubAppts();
    } else{
      let message = 'Something Went Wrong';
      this.toastrService.error(message);
    }
  });
}

confirmAppointment(){
  // console.log(this.valueData);
  this.apptDetailsCloseModal();
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'confirmAppointment', { id: this.valueData }).subscribe(response => {
    
    // console.log(response);
    if(response.status == true){
      
      let message = 'Appointement Successfully Confirmed';
      this.toastrService.success(message);
      this.getSubAppts();
    } else{
      let message = 'Something Went Wrong';
      this.toastrService.error(message);
    }
  });
}

}
