import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  loading: boolean;
  constructor(private loaderService: SpinnerService) {
    this.loaderService.isLoading.subscribe((v) => {
      // console.log(v);
      this.loading = v;
    });
  }
  ngOnInit() {
  }
}