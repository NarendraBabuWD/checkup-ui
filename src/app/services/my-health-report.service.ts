import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyHealthReportService {
  
  public user_id_emitter = new EventEmitter();
  constructor() { }

}
