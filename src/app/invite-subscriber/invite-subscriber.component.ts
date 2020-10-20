import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { InviteSubscriberService } from '../services/inviteSuscriber.service';
import { HttpService } from '../services/http.service';
import appConstants from '../config/app.constants'
// import { UtilService } from '../services/util.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invite-subscriber',
  templateUrl: './invite-subscriber.component.html',
  styleUrls: ['./invite-subscriber.component.css']
})
export class InviteSubscriberComponent implements OnInit {
  // @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  public inviteSubscriber: FormGroup;
  public inviteSubscriberSubSide: FormGroup;
  public doctorSide: Boolean = false;
  constructor(private _fb: FormBuilder, private httpService: HttpService,
    private inviteSubscriberService: InviteSubscriberService,
    private toastrService: ToastrService
    // private utilService: UtilService

  ) { }

  ngOnInit() {
    if(JSON.parse(sessionStorage.getItem("userdata")).category == 1)
    {
      this.doctorSide = true;
      } else if(JSON.parse(sessionStorage.getItem("userdata")).category == 2){
        this.doctorSide = false;
      }
    this.inviteSubscriber = this._fb.group({
      user_id: ['', [Validators.required, Validators.email]]
  });
  this.inviteSubscriberSubSide = this._fb.group({
    sub_email: ['', [Validators.required, Validators.email]]
});
  }

  get f() { return this.inviteSubscriber.controls; }

  /*onSubmit( model: FormGroup ) {
    this.inviteSubscriberService.inviteSubscriber( model.value ).subscribe( response => {
        let message = 'Subscriber Invited Successfully';
        this.toastrService.success(message);                  
    });
} */

onSubmit( model: FormGroup ) {
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'doInviteSubscriber', 
  { 
    method: "email", value: model.value.user_id
  }
  ).subscribe(response => {
    if(response.status == true){
      let message = 'Subscriber Invited Successfully';
      this.toastrService.success(message);  
    } else if(response.status == false){
      this.toastrService.error(response.data[0]);  
    }
    
  });
} 


onSubmitSubSide( model: FormGroup ) {
  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'doAddCouple', 
  { 
    email: model.value.sub_email
  }
  ).subscribe(response => {
    if(response.status == true){
      let message = 'Subscriber Invited Successfully';
      this.toastrService.success(message);  
      this.inviteSubscriberSubSide.reset();
    } else if(response.status == false){
      this.toastrService.error(response.data);  
      
    }
    
  });
} 

}
