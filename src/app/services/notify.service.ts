import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Apps from '../config/app.constants';


// import 'rxjs/Rx';
// import 'rxjs/add/operator/map';
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class NotifyService {

    private apiUrlGetGroupNotifications = Apps.apiBaseUrl + 'get_group_notifications';
    private apiUrlGetNotifications = Apps.apiBaseUrl + 'get_notifications';

    
    post(arg0: string, arg1: string) {
    throw new Error("Method not implemented.");
  }
  
  headers= new HttpHeaders({ 
    'Content-Type': 'application/json; charset=utf-8 '
  });
  options = { headers: this.headers };
  
  
  commonPost(url, body): Observable<any> {
    return this.http.post(url,
      body, this.options);
  }
  
  constructor(private http:HttpClient,
     ) { }


     getNotifications(): Observable<any> {
      let requestData = {};
      requestData = {  
          user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id
      }                      
      // console.log(requestData); 
      return this.http.post(this.apiUrlGetNotifications, requestData);
    }

  getWhatsNewNotification(): Observable<any> {
    let requestData: any = [];
  
    requestData = {};
    requestData = {  
        notification_type: "Whats_New_Notification"
    }                      
    // console.log(requestData); 
    return this.http.post(this.apiUrlGetGroupNotifications, requestData);
  }

  getHealthInfoBitsNotification(): Observable<any> {
    let requestData: any = [];
  
    requestData = {};
    requestData = {  
        notification_type: "Health_Info_Bits_Notification"
    }                      
    // console.log(requestData); 
    return this.http.post(this.apiUrlGetGroupNotifications, requestData);
  }


  getAnnouncementsNotification(): Observable<any> {
    let requestData: any = [];
  
    requestData = {};
    requestData = {  
        notification_type: "Announcements_Notification"
    }                      
    // console.log(requestData); 
    return this.http.post(this.apiUrlGetGroupNotifications, requestData);
  }
                                                                                                                                                     
}
