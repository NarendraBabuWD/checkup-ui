import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth }     from 'angularfire2/auth';
import * as firebase from 'firebase';
// import { take } from 'rxjs/operators';
import { Observable } from "rxjs";
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs';
import appConstants from './config/app.constants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({ 
          'Content-Type': 'application/json; application/x-www-form-urlencoded; charset=utf-8', 
          'Access-Control-Allow-Origin': '*', 
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 
          'Access-Control-Allow-Credentials':'true','Access-Control-Allow-Headers':'X-PINGOTHER,Content-Type,X-Requested-With,accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization','Access-Control-Expose-Headers':'xsrf-token' }),
          params: new HttpParams({})
};
@Injectable()
export class MessagingService {

  headers= new HttpHeaders({ 
    'Content-Type': 'application/json; charset=utf-8 '
  });
  options = { headers: this.headers };
  
  messaging = firebase.messaging()
  currentMessage = new BehaviorSubject(null)

  constructor(private db: AngularFireDatabase, 
    private http:HttpClient, private afAuth: AngularFireAuth) { }
    
    
  updateToken(token) {
    this.afAuth.authState.take(1).subscribe(user => {
      if (!user) return;

      const data = { [user.uid]: token }
      this.db.object('fcmTokens/').update(data)
    })
  }

  getPermission() {
      this.messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return this.messaging.getToken()
      })
      .then(token => {
        console.log(token)
        sessionStorage.setItem('fcm_token', token);
        this.updateToken(token);
        this.updateFcmTokn(token);
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
  }

    receiveMessage() {
      console.log("Message received. ");
       this.messaging.onMessage((payload) => {
        console.log("Message received. ", payload);
         sessionStorage.setItem('notification_data', payload);
        this.currentMessage.next(payload)
      });

    }

    updateFcmTokn(token) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'my-auth-token',
          'AUTHENTICATE': sessionStorage.getItem("token"),
        })
      };
        this.http.post(appConstants.apiBaseUrl + 'updateDeviceToken', 
        { device_id: token}, httpOptions).subscribe(data => {
          // console.log(data);
        });
     }
  

}