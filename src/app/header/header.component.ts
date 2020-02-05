import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AuthService } from "../auth.service";
import { HttpService } from '../services/http.service';
import appConstants from '../config/app.constants';
import { UtilService } from '../services/util.service';
import { DataService } from '../services/data.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  constructor(public auth: AuthService, private dataService : DataService, private httpService: HttpService, private utilService : UtilService ) {}
  username: string;
  isExpanded = false;
  userProfileData= [];
  user_id: number;
  user_doctor_id: number;

  @Output() public sidebarToggleHandler = new EventEmitter<boolean>(); 
  ngOnInit() {
    if (this.auth.isLoggednIn()) {
       this.username = JSON.parse(this.auth.getLoginDetails()).firstname;
    console.log(this.username);
    
      } 
    if (this.auth.isSubscriber()) {//====== if Subascriber Take user_id from session.=====
      this.user_id = JSON.parse(sessionStorage.getItem('userdata')).user_id;
      this.user_doctor_id = JSON.parse(sessionStorage.getItem('userdata')).doctor_id;
      this.profileFormReport();
    }

    

    //localStorage.setItem('testObject', JSON.stringify(this.profileFormReport));
  }
  sidebarToggle(){
    this.isExpanded = !this.isExpanded;
    this.sidebarToggleHandler.emit(this.isExpanded);
  }


  profileFormReport(){
    this.httpService.commonPost(appConstants.apiBaseUrl + 'get_subscriber_details', { user_id: this.user_id }).
    subscribe((data) => {
      this.userProfileData = data.data[0];
      this.dataService.setProfileData(this.userProfileData); 
    });
  }
  
}