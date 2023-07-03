
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FlaskapiService } from '../flaskapi.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../data.service';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [FlaskapiService],
})
export class DashboardComponent {
  public file: any;
  predictForm: any;
  periodicity:string;
  duration :string;
  final_forecast_data:any;
  loading:boolean;
  

  


  constructor(private flaskapiservice:FlaskapiService,private router: Router,private formBuilder: FormBuilder,private snackBar: MatSnackBar,private dataservice:DataService){}

  ngOnInit(): void {
    this.predictForm = this.formBuilder.group({
      file: ['', Validators.required],
      periodicity: ['', Validators.required],
      numericalValue: ['', [Validators.required, Validators.min(1)]],
    });

    this.periodicity="";
    this.file="";
    this.duration="";
    this.loading=false;

    
  }

  getFile(event: any) {
    this.file = event.target.files[0];
  }

  getprediction(){
    if(this.file == '')
    {
      this.snackBar.open("Please select a file !", "OK",
    {
      duration:4000,
      verticalPosition: 'top',
      horizontalPosition: 'center', 
    })
    }
    else if(this.periodicity == '')
    {
      this.snackBar.open("Please select Periodicity !", "OK",
    {
      duration:4000,
      verticalPosition: 'top',
      horizontalPosition: 'center', 
    })
    }
    else if(this.duration == '')
    {
      this.snackBar.open("Please enter the duration to predict !", "OK",
      {
        duration:4000,
        verticalPosition: 'top',
        horizontalPosition: 'center', 
      })
    }
    else
    {
      if((this.periodicity == "week" && parseInt(this.duration)< 4) || (this.periodicity == "day" && parseInt(this.duration)< 31))
      {
        this.snackBar.open("The duration is too short !", "OK",
      {
        duration:4000,
        verticalPosition: 'top',
        horizontalPosition: 'center', 
      })
      }
      else
      {
        this.loading=true;
      this.flaskapiservice.postfile(this.file,this.periodicity,this.duration)
      .subscribe((response)=>{
        this.loading=false;
      //  console.log(response);
       this.dataservice.getdata(response);
      this.router.navigate(['/forecast-dashboard']);
       },

       (error) => {   
        this.loading=false;                           
        this.snackBar.open("Something went wrong! Please try again later", "OK",
        {
        duration:4500,
        verticalPosition: 'top',
        horizontalPosition: 'center', 
        })
        }
       )
      }
      
    }
  }
    
  

}
