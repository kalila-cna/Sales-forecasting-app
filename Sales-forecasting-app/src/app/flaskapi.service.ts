import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FlaskapiService {

  constructor(private httpClient: HttpClient) {}

  public postfile(file:any,period:any,duration:any)
  {
    const formdata:FormData = new FormData();
    formdata.append('file',file);
    formdata.append('period',period);
    formdata.append('duration',duration);
    // console.log(JSON.stringify(formdata));

    return this.httpClient.post('http://127.0.0.1:5000/upload',formdata);
  }

  public sigin(email:any,password:any)
  {
    const formdata:FormData = new FormData();
    formdata.append('email',email);
    formdata.append('password',password);

    return this.httpClient.post('http://127.0.0.1:5000/login',formdata);
  }

}
