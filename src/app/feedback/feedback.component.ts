import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { InviteSubscriberService } from '../services/inviteSuscriber.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  public subFeedback: FormGroup;
  public docFeedback: FormGroup;
  public corpFeedback: FormGroup
  subFeedbackForm: boolean = false;
  docFeedbackForm: boolean = false;
  corpFeedbackForm: boolean = false;
  todayDate: string = '';
  nameValue: string = '';
  emailValue: string = '';
  constructor(private _fb: FormBuilder,
    private inviteSubscriberService: InviteSubscriberService,
    private toastrService: ToastrService
    // private utilService: UtilService

  ) { }

  ngOnInit() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    this.todayDate = yyyy+'-'+mm+'-'+dd;
    this.nameValue = JSON.parse(sessionStorage.getItem("userdata")).firstname;
    this.emailValue = JSON.parse(sessionStorage.getItem("userdata")).email;
    this.subFeedback = this._fb.group({
      subDate: ['', [Validators.required]],
      subName: ['', [Validators.required]],
      subEmail: ['', [Validators.required]],
      subContact: ['', [Validators.required]],
      subSubject: ['', [Validators.required]],
      subMessage: ['', [Validators.required]]      
  });

  this.docFeedback = this._fb.group({
    docDate: ['', [Validators.required]],
    docName: ['', [Validators.required]],
    docEmail: ['', [Validators.required]],
    docContact: ['', [Validators.required]],
    docSubject: ['', [Validators.required]],
    docMessage: ['', [Validators.required]]    
});

this.corpFeedback = this._fb.group({
  corpDate: ['', [Validators.required]],
  corpName: ['', [Validators.required]],
  corpEmail: ['', [Validators.required]],
  corpContact: ['', [Validators.required]],
  corpSubject: ['', [Validators.required]],
  corpMessage: ['', [Validators.required]]    
});

// console.log(JSON.pa nvrse(sessionStorage.getItem("userdata")).category_name);

if(JSON.parse(sessionStorage.getItem("userdata")).category_name == "Doctor")
{
  this.docFeedbackForm = true;
  this.subFeedbackForm = false;
  this.corpFeedbackForm = false;
} else if(JSON.parse(sessionStorage.getItem("userdata")).category_name == "WeCheckup"){
  this.docFeedbackForm = false;
  this.subFeedbackForm = false;
  this.corpFeedbackForm = true;
} else{
  this.subFeedbackForm = true;
  this.corpFeedbackForm = false;
  this.docFeedbackForm = false;
}
  }

  docFeedbackSubmit( model: FormGroup ) {
    this.inviteSubscriberService.doctorFeedback( model.value ).subscribe( response => {
        let message = 'Feedback Added Successfully';
        this.toastrService.success(message); 
        this.docFeedback.reset();                  
    },
        error => {
          //   this.alertNotSuccess();
            
        } );
} 

subFeedbackSubmit( model: FormGroup ) {
  this.inviteSubscriberService.subscriberFeedback( model.value ).subscribe( response => {
      let message = 'Feedback Added Successfully';
      this.toastrService.success(message);   
      this.subFeedback.reset();          
  },
      error => {
        //   this.alertNotSuccess();
          
      } );

} 

corpFeedbackSubmit( model: FormGroup ) {
  this.inviteSubscriberService.corporateFeedback( model.value ).subscribe( response => {
      let message = 'Feedback Added Successfully';
      this.toastrService.success(message);      
      this.corpFeedback.reset();       
  },
      error => {
        //   this.alertNotSuccess();
          
      } );

} 
}
