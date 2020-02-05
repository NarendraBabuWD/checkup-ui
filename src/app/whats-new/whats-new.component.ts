import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-whats-new',
  templateUrl: './whats-new.component.html',
  styleUrls: ['./whats-new.component.css']
})
export class WhatsNewComponent implements OnInit {

  whatsnewList: any = [];

  constructor(private notifyService: NotifyService) { }

  ngOnInit() {
    this.getWhatsNew();
  }

  getWhatsNew() {
    this.whatsnewList = [];
    this.notifyService.getWhatsNewNotification().subscribe( response => {
        // console.log(response);
        // console.log(response.data); 
        this.whatsnewList = response.data;            
    },
        error => {
          //   this.alertNotSuccess();
            
        } );

} 
}
