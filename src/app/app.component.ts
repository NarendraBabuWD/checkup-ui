import { Component, OnInit  } from '@angular/core';
import { AuthService } from "./auth.service";
// import { MessagingService } from "./messaging.service";   


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public auth: AuthService, 
    // private msgService: MessagingService
  ) {}
  message;

  // constructor(private msgService: MessagingService) {}

  ngOnInit() {
    // this.msgService.getPermission();
    // this.msgService.receiveMessage();
    // this.message = this.msgService.currentMessage;
  }
  title = 'checkup-ui';
  isSidebarExpanded = false;
  sidebarToggle(e){
    this.isSidebarExpanded = e;
  }
}
