import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../helpers/must-match.validator';
import appConstants from '../config/app.constants';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {Http,Headers,} from '@angular/http';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private httpService: HttpService, 
              private formBuilder: FormBuilder, 
              private router: Router, private http:HttpClient,
              private toastrService: ToastrService) { }

              /*headers = new HttpHeaders({ 
                'Content-Type': 'application/json; charset=utf-8; application/x-www-form-urlencoded',
                'Accept' : 'application/json',
                'Access-Control-Allow-Origin' : 'http://localhost',
                'Access-Control-Allow-Credentials' : 'true'

               });
              options = { headers: this.headers };*/
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

    this.httpService.commonPost(appConstants.apiBaseUrl + 'doRegister', this.signupForm.value).subscribe((res: Response) => {
      console.log(res, "User Sucessfully Sign Up!.");
      console.log(res);
      this.toastrService.warning("User Sucessfully Sign Up!.");  
      this.router.navigate(["login"]);
    }, error => {
        // console.log(error);
        let message = 'User Already Exists';
        this.toastrService.warning(message);  
    })
  }


/*
signup() {
  console.log(this.signupForm.value);  
  // const myheader = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:4200');
  let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Headers', "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding");
    // let options = new RequestOptions({ headers: headers });
    let options = { headers: headers };
    console.log(options)
    let body = "firstname="+this.signupForm.value.firstname+"&lastname="+this.signupForm.value.lastname+"&email="+this.signupForm.value.email+"&password="+this.signupForm.value.password+"&category="+this.signupForm.value.category_name;
    console.log(body);
    

    this.http
      .post(appConstants.apiBaseUrl + 'doRegister?'+body,
      options)
        .subscribe(data => {
              console.log(data);
        }, error => {
            console.log(JSON.stringify(error.json()));
        });
}
*/

  login(){
    this.router.navigate([appConstants.routingList.LOGIN_COMPONENT]);
  }

  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('body-bg-color-theme');
  }

}
