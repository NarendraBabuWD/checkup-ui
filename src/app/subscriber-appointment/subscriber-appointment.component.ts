import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

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
  doctorId: string = '';
  date: string = '';
  time: string = '';
  doctor: string = '';
  for: string = '';
  address: string = '';
  status: string = '';
  valueData: string = '';
  constructor(private _fb: FormBuilder, private toastrService: ToastrService
    , private appointmentService: AppointmentService,) { }

  ngOnInit() {
    this.getSubNewAppts();
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

  getSubNewAppts(){
    this.dataList = [];
    this.appointmentService.getSubNewAppts().subscribe(disList => {
      // console.log(disList);
      // console.log(typeof(disList)); 
      // consoleconsole.log(disList['data']);
         this.dataList = disList['data']; 
        
    });
  }

  getSubAppts(){
    this.appList = [];
    this.appointmentService.getSubAppts().subscribe(disList => {
      // console.log(disList);
      // console.log(typeof(disList)); 
      // console.log(disList['data']);
         this.appList = disList['data']; 
         
        
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
  this.valueData = value;
 
  this.apptDetails = true;
  this.date = '';
  this.time = '';
  this.doctor = '';
  this.for = '';
  this.address = '';
  this.status = '';

  this.date = value.date;
  this.time = value.time;
  this.doctor = value.doctor;
  this.for = value.quarter;
  this.address = value.address_of_clinic_1;
  this.status = value.status;
}
reschedule(){
  // console.log(this.valueData);

  this.appointmentService.rescheduleApptStatus(this.valueData).subscribe(response => {
    // console.log(response);
     
   let message = 'Appointement Successfully Rescheduled';
      this.toastrService.success(message);     
      this.apptDetailsCloseModal(); 
      this.getSubAppts();     
  });
}

cancelStatus(){
  this.appointmentService.cancelApptStatus(this.valueData).subscribe(response => {
    console.log(response);
    // console.log(typeof(disList)); 
    // console.log(disList['data']);
      //  this.dataList = disList['data']; 
   
      this.toastrService.success(response.message);     
      this.apptDetailsCloseModal(); 
      this.getSubAppts();     
  });
}

}
