import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notificationList: any = [];

  constructor(private notifyService: NotifyService) { }

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications() {
    this.notificationList = [];
    this.notifyService.getNotifications().subscribe( response => {
        // console.log(response);
        // console.log(response.data); 
        this.notificationList = response.data; 
        
        
                   
    },
        error => {
          //   this.alertNotSuccess();
            
        } );

} 

}
