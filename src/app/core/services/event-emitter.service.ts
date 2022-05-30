import { Injectable, EventEmitter } from '@angular/core';    
import { Subscription } from 'rxjs/internal/Subscription';    
    
@Injectable({    
  providedIn: 'root'    
})    
export class EventEmitterService {    
    
  invokeOverviewComponentFunction = new EventEmitter();    
  subsVar: Subscription;    
    
  constructor() { }    
    
  callOverviewComponentFunction(param: any) {    
    this.invokeOverviewComponentFunction.emit(param);    
  }    
}