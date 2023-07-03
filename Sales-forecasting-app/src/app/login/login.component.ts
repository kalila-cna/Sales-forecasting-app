import { Component } from '@angular/core';
import {FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlaskapiService } from '../flaskapi.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {
  hide=true;
  password_value:String;
  email_value:String;
  email = new FormControl('', [Validators.required, Validators.email]);
  
  constructor(private router: Router,private snackBar: MatSnackBar,private flaskapiservice:FlaskapiService){}
 
  ngOnInit()
  {
   this.password_value="";
   this.email_value="";
  }
 
  getErrorMessage() 
  {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
 
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
 
  login()
  {
   if(this.email.value == '')
   {
     this.snackBar.open("Email Id cannot be empty !", "OK",
     {
       duration:4000,
       verticalPosition: 'top',
       horizontalPosition: 'center', 
     })
   }

   else if(this.password_value == '')
   {
     this.snackBar.open("Password cannot be empty !", "OK",
     {
       duration:4000,
       verticalPosition: 'top',
       horizontalPosition: 'center',
     })
   }

   else
   {
      this.flaskapiservice.sigin(this.email_value,this.password_value)
      .subscribe((response)=>{
        // console.log(response);
        if(response == "valid login")
        {
          this.router.navigate(['/dashboard']);
        }
        else if(response == "password is incorrect")
        {
          this.snackBar.open(response.toString(), "OK",
          {
           duration:4000,
           verticalPosition: 'top',
           horizontalPosition: 'center',
          }
          );
        }
        else
        {
          this.snackBar.open(response.toString(), "OK",
          {
           duration:4000,
           verticalPosition: 'top',
           horizontalPosition: 'center',
          }
          );
        }
      },
      
      (error) => {                              
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
 
  reset()
  {
   this.password_value="";
   this.email_value="";
  }
}
