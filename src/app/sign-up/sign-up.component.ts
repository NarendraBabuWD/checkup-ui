import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../helpers/must-match.validator';
import appConstants from '../config/app.constants';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private httpService: HttpService, 
              private formBuilder: FormBuilder, 
              private router: Router,
              private toastrService: ToastrService) { }
  signupForm: FormGroup;
  submitted = false;
  categoryList: any;
  category_name: any;
  fnameLabel = false;
  lnameLabel = false;
  emailLabel = false;
  passLabel = false;
  cpassLabel = false;
  categoryLabel = false;
  
  ngOnInit() {
    document.querySelector('body').classList.add('body-bg-color-theme');
    this.category_name = null;
    this.categoryList = [{ name: appConstants.userType.SUBSCRIBER, value: appConstants.userType.SUBSCRIBER }, 
                         { name: appConstants.userType.DOCTOR, value: appConstants.userType.DOCTOR },
                         { name: appConstants.userType.CORP, value: appConstants.userType.CORP }];

    this.signupForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(1)]],
      lastname: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      category_name: ['',  Validators.required]
    }, {
        validator: MustMatch('password', 'confirmPassword')
      });
      this.signupForm.controls['category_name'].setValue(this.category_name, {onlySelf: true});
  }
  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }
  signup() {
    // console.log(this.signupForm.value);
    this.httpService.commonPost(appConstants.apiBaseUrl + 'sign_up', this.signupForm.value).subscribe((res: Response) => {
      console.log(res, "User Sucessfully Sign Up!.");
      console.log(res);
     /* if (this.signupForm.value.category_name === appConstants.userType.SUBSCRIBER) {
        this.router.navigate([appConstants.routingList.SUBSCRIBER_COMPONENT]);
      }
      if (this.signupForm.value.category_name === appConstants.userType.DOCTOR) {
        this.router.navigate([appConstants.routingList.DOCTOR_COMPONENT]);
      }*/
      this.router.navigate(["login"]);
    }, error => {
        // console.log(error);
        let message = 'User Already Exists';
        this.toastrService.warning(message);  
    })
  }

  login(){
    this.router.navigate([appConstants.routingList.LOGIN_COMPONENT]);
  }

  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('body-bg-color-theme');
  }

}
