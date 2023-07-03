import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getdata(data:any)
  {
    localStorage.setItem('metricsData',JSON.stringify(data));
  }
}
