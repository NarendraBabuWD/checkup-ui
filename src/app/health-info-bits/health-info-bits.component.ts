import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-health-info-bits',
  templateUrl: './health-info-bits.component.html',
  styleUrls: ['./health-info-bits.component.css']
})
export class HealthInfoBitsComponent implements OnInit {

  infoBitList: any = [];

  constructor(private notifyService: NotifyService) { }

  ngOnInit() {
    this.getHealthInfoBits();
  }

  getHealthInfoBits() {
    this.infoBitList = [];
    this.notifyService.getHealthInfoBitsNotification().subscribe( response => {
        // console.log(response);
        // console.log(response.data); 
        this.infoBitList = response.data;            
    },
        error => {
          //   this.alertNotSuccess();
            
        } );

} 

}
