import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../services/notify.service';
import { HttpService } from '../services/http.service';
import appConstants from '../config/app.constants'

@Component({
  selector: 'app-whats-new',
  templateUrl: './whats-new.component.html',
  styleUrls: ['./whats-new.component.css']
})
export class WhatsNewComponent implements OnInit {

  whatsnewList: any = [];

  constructor(private notifyService: NotifyService, private httpService: HttpService) { }

  ngOnInit() {
    this.getWhatsNew();
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
