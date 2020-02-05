import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  title: string;
  msg: string;
  primaryBtn: string;
  secondaryBtn: string;
  primaryBtnCallback: any;
  secondaryBtnCallback: any;
  modalRef: BsModalRef;
  constructor(public bsModalRef: BsModalRef) { }
  ngOnInit() {
  }

  primaryBtnClickHadler(){
    if(this.primaryBtnCallback){
      this.primaryBtnCallback();
    }
    this.bsModalRef.hide()
  }
  secondaryBtnClickHadler(){
    if(this.secondaryBtnCallback){
      this.secondaryBtnCallback();
    }
    this.bsModalRef.hide()
  }
}
