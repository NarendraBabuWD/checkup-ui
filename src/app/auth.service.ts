import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import appConstants from './config/app.constants';


@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private myRoute: Router) {}

  setLoginDetails(data: Object) {
    sessionStorage.setItem('userdata',JSON.stringify(data));
  }
  getLoginDetails() {
    return sessionStorage.getItem("userdata");
  }
  isLoggednIn() {
    return this.getLoginDetails() !== null;
  }
  getUserId() {
    const userData = this.getLoginDetails();
    if (userData && JSON.parse(userData).user_id) {
        return JSON.parse(userData).user_id;
      }
    return null;
  }

  getDoctorId() {
    const userData = this.getLoginDetails();
    if (userData && JSON.parse(userData).doctor_id) {
        return JSON.parse(userData).doctor_id;
      }
    return null; 
  }

  username() {
    // console.log(sessionStorage.getItem("userdata"));
    return JSON.parse(sessionStorage.getItem("userdata")).firstname;
  }
  isSubscriber() {
    return JSON.parse(sessionStorage.getItem("userdata")).category_name === appConstants.userType.SUBSCRIBER;
  }
  isDoctor() {
    return JSON.parse(sessionStorage.getItem("userdata")).category_name === appConstants.userType.DOCTOR;
  }
  isCorporate() {
    return JSON.parse(sessionStorage.getItem("userdata")).category_name === appConstants.userType.CORP;
  }

  getUserType() {
    return JSON.parse(sessionStorage.getItem("userdata")).category_name;
  }
  getMRN() {
    return JSON.parse(sessionStorage.getItem("userdata")).mrn;
  }

  logout() {
    sessionStorage.removeItem("userdata");
    sessionStorage.clear();
    this.myRoute.navigate(["login"]);
  }
}
