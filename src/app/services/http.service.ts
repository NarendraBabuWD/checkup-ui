import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

const httpOptions = {
  // headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers':'X-Requested-With' }),
  headers: new HttpHeaders({ 
          'Content-Type': 'application/json; application/x-www-form-urlencoded; charset=utf-8', 
          'Access-Control-Allow-Origin': '*', 
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 
          'Access-Control-Allow-Credentials':'true','Access-Control-Allow-Headers':'X-PINGOTHER,Content-Type,X-Requested-With,accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization','Access-Control-Expose-Headers':'xsrf-token' }),
          params: new HttpParams({})
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }
  headers = new HttpHeaders({ 
    'Content-Type': 'application/json; application/x-www-form-urlencoded; charset=utf-8',
    'Authorization': 'token',
    'Accept' : 'application/json',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Credentials' : 'true' 
  });
  
  options = { headers: this.headers };

  commonGet(url, params?): Observable<any> {
    return this.http.get(url, { headers: this.headers, params: params });
  }
  

  createAuthorizationHeader(headers: Headers) {
    console.log(sessionStorage.getItem("token"));
    headers.set('Authorization', 'my-auth-token');
    headers.append('AUTHENTICATE', sessionStorage.getItem("token")); 
    
  }


  
  commonPost(url, body): Observable<any> {
    return this.http.post(url,
      body, httpOptions);
  }

  commonAuthPost(url, body, params?): Observable<any> {
    // let headers = new Headers();
    // this.createAuthorizationHeader(headers);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'my-auth-token',
        'AUTHENTICATE': sessionStorage.getItem("token"),
      })
    };
   
    return this.http.post(url,
      body, httpOptions);
  }

  
}
