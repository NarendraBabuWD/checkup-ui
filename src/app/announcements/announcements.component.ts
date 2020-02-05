import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {
  anouncementList: any = [];

  constructor(private notifyService: NotifyService) { }

  ngOnInit() {
    this.getAnnouncements();
  }
 
  getAnnouncements() {
    this.anouncementList = [];
    this.notifyService.getAnnouncementsNotification().subscribe( response => {
        // console.log(response);
        // console.log(response.data); 
        this.anouncementList = response.data;            
    },
        error => {
          //   this.alertNotSuccess();
            
        } );

} 

}
