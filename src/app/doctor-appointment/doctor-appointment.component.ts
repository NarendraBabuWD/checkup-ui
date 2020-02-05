import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-doctor-appointment',
  templateUrl: './doctor-appointment.component.html',
  styleUrls: ['./doctor-appointment.component.css']
})
export class DoctorAppointmentComponent implements OnInit {

  public doctorApp: FormGroup;
  listViewUi: boolean = false;
  dataList:  any[] = [];
  showModal: boolean = false;
  doctorId: string = '';
  constructor(private _fb: FormBuilder, private toastrService: ToastrService
    , private appointmentService: AppointmentService,) { }

  ngOnInit() {
    this.doctorId = JSON.parse(sessionStorage.getItem("userdata")).user_id,
    this.getGetAppts();
    this.doctorApp = this._fb.group({
      date: ['', [Validators.required]],
      time: ['', [Validators.required]]
  });

  }

  getGetAppts(){
    this.dataList = [];
    this.appointmentService.getGetAppts().subscribe(disList => {
         this.dataList = disList['data'];   
    });
  }
  openModal(){
      this.showModal = true;
      this.doctorApp.reset();
  }
  closeModal(){
    this.showModal = false;
}
onSubmit( model: FormGroup ) {
  this.appointmentService.createDrAppts( model.value ).subscribe( response => {
      let message = 'Appointment Slot Created';
      this.toastrService.success(message);    
      this.closeModal(); 
      this.getGetAppts();             
  },
      error => {
        //   this.alertNotSuccess();
          
      } );

}
}
