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
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {
  anouncementList: any = [];

  constructor(
    private notifyService: NotifyService, private httpService: HttpService,
    location: PlatformLocation, private router: Router, private Location: Location) { }

  ngOnInit() {
    this.getAnnouncements();
  }
 
  /*getAnnouncements() {
    this.anouncementList = [];
    this.notifyService.getAnnouncementsNotification().subscribe( response => {
        // console.log(response);
        // console.log(response.data); 
        this.anouncementList = response.data;            
    },
        error => {
          //   this.alertNotSuccess();
            
        } );

} */


getAnnouncements() {
  this.anouncementList = [];
  /*this.notifyService.getAnnouncementsNotification().subscribe( response => {
      // console.log(response);
      // console.log(response.data); 
      this.anouncementList = response.data;            
  },*/

  this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getNewsList', { }).subscribe(response => {
    console.log(response.data);
    this.anouncementList = response.data;
  },

      error => {
        //   this.alertNotSuccess();
          
      } );

} 

}
