
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TestUsers } from 'src/app/core/utils/constant';

import { AuthService } from 'src/app/core/services/auth.service';
import * as jwt_decode from 'jwt-decode';
import { ResetPasswordComponent } from '../../dialogs/reset-password/reset-password.component';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isPasswordVisible = false;
  public showError = false;
  loginFailed = false;

  public token;

  constructor(
    private dialog: DialogService,
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService
  ) { }

  ngOnInit() {
    // Create form group
    this.loginForm = this.fb.group({
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });

    // Get token from query params
    this.route.queryParamMap.subscribe(
      queryParams => {
        this.token = queryParams['params'].token;
        // console.log(this.token);
      });
  }

  doLogin() {
    this.loginFailed = false;

    this.authService.login(this.loginForm.value).toPromise()
      .then(
        response => {
          this.router.navigate(['/home']);
          if (response.auth) {
            const token = response.token;
            const tokenDecoded = this.getDecodedAccessToken(token);
            const role = tokenDecoded.type;
            // console.log('Login as ' + role);
            this.authService.setSession(token);
          } else {

          }
        },
        error => {
          // console.log(error);
          this.loginFailed = true;
        }
      );
  }

  private loginByTestUser(data: any) {
    const user = TestUsers.CREDENTIALS[data.email];

    if (user) {
      if (user.PASSWORD === data.password) {
        // console.log('Login as ' + user.ROLE);
        localStorage.setItem('role', user.ROLE);
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
    this.dialog.getResetPasswordDialog();
  }

  // onSubmit() {
  //   // const newPassword = {
  //   //   'newPassword': this.loginForm.value.password
  //   // };

  //   this.authService.changePassword(newPassword, this.token).subscribe(
  //     data => {
  //       // console.log('Successfully change password.', data);
  //       this.router.navigate(['/home']);
  //     },
  //     err => {
  //       // console.log('Failed change password.');
  //       if (err.message.includes('Failed to authenticate token')) {
  //         // console.log('Token to reset password expired');
  //         this.router.navigate(['']);
  //       }
  //     }
  //   );

  // }

  hideErrorMessage() {
    this.showError = false;
  }

  showErrorMessage() {
    this.showError = true;
  }

}
