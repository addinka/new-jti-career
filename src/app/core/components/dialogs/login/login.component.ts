import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { TestUsers, Constant } from 'src/app/core/utils/constant';
import { RegexMapping } from 'src/app/core/utils/regex.mapping';

import * as jwt_decode from 'jwt-decode';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  public loginForm: FormGroup;
  public isPasswordVisible = false;
  public showError = false;
  loginFailed = false;
  showPassword=true;
  btndisable=true;

  constructor(
    private dialog: MatDialog,
    private overlay: Overlay,
    public dialogRef: MatDialogRef<LoginComponent>,
    private fb: FormBuilder,
    private authService: AuthService) {
    dialogRef.disableClose = true;
    this.loginForm = this.fb.group({
      password: ['', [Validators.required]],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern(RegexMapping.EMAIL_VALIDATOR)
      ])],
    });
  }

  close(next: any): void {
    this.dialogRef.close({ next: next });
  }
 checkemail(email: string): void{
    let example = email;
    let ourSubstring = "ibm-jti.com";
  
    if (example.includes(ourSubstring)) {
      this.showPassword=false;
      this.btndisable=false;
    }else {
      this.showPassword=true;
      this.btndisable=true;
    }   
    console.log("show password:",this.showPassword);
  }
  checkpassword(pass: string): void{
    let passlength=pass.length;
    console.log(passlength);
    if(passlength>0){
      this.btndisable=false;
    }else{
      this.btndisable=true;
    }
  }
  doLogin() {
    this.loginFailed = false;
    let email=this.loginForm.value['email'];
    let ourSubstring = "ibm-jti.com";
    if(email.includes(ourSubstring)){
      console.log("email jti");
      //fungsi kalo email ibm-jti.com
      this.authService.loginjti(this.loginForm.value).toPromise()
      .then(
        response => {
          console.log(response);
          /*if (response.auth) {
            const token = response.token;
            const tokenDecoded = this.getDecodedAccessToken(token);
            const role = tokenDecoded.type;
            // console.log('Login as ' + role);
            this.authService.setSession(token);

            this.dialogRef.close({role: role, token: token });
          } else {

          }*/
        },
        error => {
          console.log(error);
          this.loginFailed = true;
        }
      );
    }else{
      console.log("email bukan jti");
      //fungsi kalo email bukan ibm-jti.com
      this.authService.login(this.loginForm.value).toPromise()
      .then(
        response => {
          if (response.auth) {
            const token = response.token;
            const tokenDecoded = this.getDecodedAccessToken(token);
            const role = tokenDecoded.type;
            // console.log('Login as ' + role);
            this.authService.setSession(token);

            this.dialogRef.close({role: role, token: token });
          } else {

          }
        },
        error => {
          // console.log(error);
          this.loginFailed = true;
        }
      );
    }
  }

  private loginByTestUser(data: any) {
    const user = TestUsers.CREDENTIALS[data.email];

    if (user) {
      if (user.PASSWORD === data.password) {
        // console.log('Login as ' + user.ROLE);
        localStorage.setItem('role', user.ROLE);
        this.dialogRef.close({
          role: user.ROLE,
          token: Constant.TOKEN_DUMMY
        });
      } else {
        // console.log('Wrong password!');
        this.loginFailed = true;
      }
    } else {
      // console.log('Email not found!');
      this.loginFailed = true;
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  openDialogReset() {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '468px',
      backdropClass: 'backgroundBlur',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });

    this.close(false);

    dialogRef.afterClosed().subscribe(result => {
      if (!result.next) {
        this.close(false);
      } else {
        this.dialog.open(LoginComponent, {
          width: '468px',
          backdropClass: 'backgroundBlur',
          scrollStrategy: this.overlay.scrollStrategies.noop()
        });
      }
    });
  }
}
