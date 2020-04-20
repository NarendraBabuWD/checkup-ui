import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../services/notify.service';
import { HttpService } from '../services/http.service';
import appConstants from '../config/app.constants'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notificationList: any = [];

  constructor(private notifyService: NotifyService, private httpService: HttpService) { }

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications(){
  
    this.httpService.commonAuthPost(appConstants.apiBaseUrl + 'getNotificationList', { }).subscribe(response => {
      // console.log(response.data);
      this.notificationList = response.data;
    });
    
  }
  /*getNotifications() {
    this.notificationList = [];
    this.notifyService.getNotifications().subscribe( response => {
        // console.log(response);
        // console.log(response.data); 
        this.notificationList = response.data;                
    },
        error => {
          //   this.alertNotSuccess();
            
        } );

} */

}
