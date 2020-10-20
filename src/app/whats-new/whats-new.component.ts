import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../services/notify.service';
import { HttpService } from '../services/http.service';
import appConstants from '../config/app.constants';
import { PlatformLocation } from '@angular/common';
// import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {Router, NavigationEnd} from "@angular/router";
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-whats-new',
  templateUrl: './whats-new.component.html',
  styleUrls: ['./whats-new.component.css']
})
export class WhatsNewComponent implements OnInit {

  whatsnewList: any = [];
  previousUrl:string;


  constructor(private notifyService: NotifyService, private httpService: HttpService,
    location: PlatformLocation, private router: Router, private Location: Location) { 
      
    location.onPopState(() => {
      console.log("onPopState called");
      // window.alert("your data will be lost");

      // var r = confirm("Are you sure you want to leave this page? <br> Your data will not be saved");
      var newLine = "\r\n"
      var msg = "Are you sure you want to leave this page?"
      msg += newLine;
      msg += "Your data will not be saved";
      msg += newLine;
      // msg += "Simply Easy Learning";
      // msg+= newLine;
      // msg += "TutorialsPoint.com";
      var r = confirm(msg);
      if (r == true) {
        // this.router.navigate(['/'+this.previousUrl+'']);
        console.log("OK");
        this.router.navigate(['/home']);
    } else {
      console.log("CANCEL");
      this.router.navigate(['/']);
        // Stay on the current page.
        // history.pushState(null, null, window.location.href);
        // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        // this.router.onSameUrlNavigation = 'reload';
        // return false;
    }

    })
    }

  ngOnInit() {
    this.getWhatsNew();

  }

  navigateBack() {
    this.Location.back();
  }   

  getWhatsNew(){
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getNewsList', { }).subscribe(response => {
      console.log(response.data);
      this.whatsnewList = response.data;
    });
    
  }

  /*getWhatsNew() {
    this.whatsnewList = [];
    this.notifyService.getWhatsNewNotification().subscribe( response => {
        // console.log(response);
        // console.log(response.data); 
        this.whatsnewList = response.data;            
    },
        error => {
          //   this.alertNotSuccess();
            
        } );

} */



}
