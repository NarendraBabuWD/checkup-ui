import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { InviteSubscriberService } from '../services/inviteSuscriber.service';

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

  constructor(private _fb: FormBuilder,
    private inviteSubscriberService: InviteSubscriberService,
    private toastrService: ToastrService
    // private utilService: UtilService

  ) { }

  ngOnInit() {
    let numPattern = /^[0-9]\d{9}$/;

    this.inviteSubscriber = this._fb.group({
      user_id: ['', [Validators.required, Validators.pattern(numPattern)]],
      
  });
  }

  onSubmit( model: FormGroup ) {
    this.inviteSubscriberService.inviteSubscriber( model.value ).subscribe( response => {
        let message = 'Subscriber Invited Successfully';
        this.toastrService.success(message);                  
    },
        error => {
          //   this.alertNotSuccess();
            
        } );

} 
}
