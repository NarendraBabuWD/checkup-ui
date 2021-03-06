import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css']
})
export class ResponseComponent implements OnInit {

  public href: string = "";

  
  constructor(private router: Router) {}

  ngOnInit() {
        this.href = this.router.url;
        console.log(this.router.url);
  }

}
