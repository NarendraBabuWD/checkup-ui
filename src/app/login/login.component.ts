import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import appConstants from '../config/app.constants';
import { AuthService } from "../auth.service";
import { InviteSubscriberService } from '../services/inviteSuscriber.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';


// import { MessagingService } from "../messaging.service";   

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
message;
@ViewChild('shownModal', { static: false }) shownModal: ModalDirective;

  constructor(private httpService: HttpService, 
              private formBuilder: FormBuilder, 
              private router: Router, private http:HttpClient,
              private inviteSubscriberService: InviteSubscriberService,
              // private msgService: MessagingService, 
              private toastrService: ToastrService,
              private authService: AuthService) { }
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  emailLabel = false;
  passLabel = false;
  lognRes: any;
  isModalShown = false;

  ngOnInit() {
    document.querySelector('body').classList.add('body-bg-color-theme');
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
     });

     this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
     });

    //  this.msgService.getPermission();
    //  this.msgService.receiveMessage();
    // this.message = this.msgService.currentMessage;
    
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  get c() { return this.forgotPasswordForm.controls; }

  
  login(){
    this.httpService.commonPost(appConstants.apiBaseUrl + 'doLogin',this.loginForm.value).subscribe((res) =>{
      console.log(res, "User Sucessfully Logged in!.");
      this.lognRes = res;
      
        if(this.lognRes.data.category === appConstants.userType.SUBSCRIBER || this.lognRes.data.category === appConstants.userType.DOCTOR){
          this.authService.setLoginDetails(this.lognRes.data);
          this.authService.setLoginToken(this.lognRes.authenticate);
            console.log(this.lognRes.data.category);
          this.router.navigate([appConstants.routingList.HOME_COMPONENT]);
        } else if(this.lognRes.status == false) {
            this.toastrService.error(this.lognRes.data[0]);
        }else {
          // this.router.navigate(['/health-data']);
            this.toastrService.error("User Not Exists !.");
            // this.router.navigate(["login"]);
        }

    })
  }
  forgotPasswordBtn(){
      //  console.log(this.forgotPasswordForm.value);
       this.httpService.commonPost(appConstants.apiBaseUrl + 'doForgotPassword',this.forgotPasswordForm.value).subscribe((res:Response) =>{
        // console.log(res, "Mail Sent Sucessfully !.");
        this.toastrService.success("Mail Sent Sucessfully !.");
        this.forgotPasswordForm.reset();
        this.isModalShown = false;
      })
       
  }

  /*login() {
    console.log(this.loginForm.value);  
    let headers = new Headers();
      headers.append('Content-Type','application/json');
      headers.append('Accept', 'application/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Access-Control-Allow-Headers', "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding");
      // let options = new RequestOptions({ headers: headers });
      let options = { headers: headers };
      console.log(options)
      let body = "username="+this.loginForm.value.email+"&password="+this.loginForm.value.password;
      console.log(body);
      
  
      this.http
        .post(appConstants.apiBaseUrl + 'doLogin?'+body,
        options)
          .subscribe(data => {
                console.log(data);
          }, error => {
              console.log(JSON.stringify(error.json()));
          });
  }*/

  signup(){
    this.router.navigate([appConstants.routingList.SIGNUP_COMPONENT]);
  }
  
  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('body-bg-color-theme');
  }


  forgotPassword(){
    this.isModalShown = true;
  }

  hideNotifyModal(): void {
    // this.isModalShown.hide();
    this.isModalShown = false;
    this.forgotPasswordForm.reset();
  }

}