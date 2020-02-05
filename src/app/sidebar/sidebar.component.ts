import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public auth: AuthService,  private router: Router,) { }
  @Input() isSidebarExpanded;
  ngOnInit() {

  }

  sidebarDashboard(){
    if(JSON.parse(sessionStorage.getItem("userdata")).category_name == "WeCheckup"){
      this.router.navigate(['/health-data']);
     } else{
      this.router.navigate(['/home']);
  }
  }
}
