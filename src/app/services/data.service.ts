import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private subscriber_id = new BehaviorSubject('');
  private quartelyReport = new BehaviorSubject({});
  private yearlyReport = new BehaviorSubject({});
  private profileData = new BehaviorSubject({});
  getSubscriberId = this.subscriber_id.asObservable(); 
  getQuartelyReport = this.quartelyReport.asObservable();
  getYearlyReport = this.yearlyReport .asObservable();
  getProfileData = this.profileData.asObservable();

  

  constructor() { }

  setSubscriberId(message: string) {
    this.subscriber_id.next(message)
  }

  setQuartelyReport(message: Object) {
    this.quartelyReport.next(message)
  }

  setYearlyReport(message: Object) {
    this.yearlyReport.next(message)
  }

  setProfileData(message: Object) {
    this.profileData.next(message)
  }

}