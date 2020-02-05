// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import Apps from './config/app.constants';
// import { AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireAuth }     from 'angularfire2/auth';
// import * as firebase from 'firebase';
// // import { take } from 'rxjs/operators';
// import { Observable } from "rxjs";
// import 'rxjs/add/operator/take';
// import { BehaviorSubject } from 'rxjs'

// @Injectable()
// export class MessagingService {
  // private apiUrlUpdateUserFcmToken = Apps.apiBaseUrl +'update_user_fcm_token';

  // headers= new HttpHeaders({ 
  //   'Content-Type': 'application/json; charset=utf-8 '
  // });
  // options = { headers: this.headers };
  
  // messaging = firebase.messaging()
  // currentMessage = new BehaviorSubject(null)

  // constructor(private db: AngularFireDatabase, 
  //   private http:HttpClient, private afAuth: AngularFireAuth) { }
    
    
  // updateToken(token) {
  //   this.afAuth.authState.take(1).subscribe(user => {
  //     if (!user) return;

  //     const data = { [user.uid]: token }
  //     this.db.object('fcmTokens/').update(data)
  //   })
  // }

  // getPermission() {
  //     this.messaging.requestPermission()
  //     .then(() => {
  //       console.log('Notification permission granted.');
  //       return this.messaging.getToken()
  //     })
  //     .then(token => {
  //       // console.log(token)
  //       sessionStorage.setItem('fcm_token', token);
  //       this.updateToken(token)
  //     })
  //     .catch((err) => {
  //       console.log('Unable to get permission to notify.', err);
  //     });
  // }

  //   receiveMessage() {
  //     console.log("Message received. ");
  //      this.messaging.onMessage((payload) => {
  //       console.log("Message received. ", payload);
  //        sessionStorage.setItem('notification_data', payload);
  //       this.currentMessage.next(payload)
  //     });

  //   }

  /*updateUserFcmToken(): Observable<any> {
    console.log("enter"); 
    let request: any = [];
    request = {};
    request = {
            user_id: JSON.parse(sessionStorage.getItem("userdata")).user_id,
            fcm_token: sessionStorage.getItem("fcm_token") 
    };    
    console.log(this.apiUrlUpdateUserFcmToken); 
    console.log(request);
    
    return this.http.post(this.apiUrlUpdateUserFcmToken, request);
    console.log("response"); 
  }*/
  

// }