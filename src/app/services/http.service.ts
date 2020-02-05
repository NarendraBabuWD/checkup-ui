import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }
  headers = new HttpHeaders({ 
    'Content-Type': 'application/json; charset=utf-8'       
  });
  options = { headers: this.headers };

  commonGet(url, params?): Observable<any> {
    return this.http.get(url, { headers: this.headers, params: params });
  }
  
  commonPost(url, body): Observable<any> {
    return this.http.post(url,
      body, this.options);
  }

}
