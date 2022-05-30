
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  isPasswordVisible: any = {
    password: false,
    confirmPassword: false
  };
  myForm: FormGroup;
  showError: Boolean = false;

  public token;

  constructor(
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    // Create form group
    this.myForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });

    // Get token from query params
    this.route.queryParamMap.subscribe(
      queryParams => {
        this.token = queryParams['params'].token;
        // console.log(this.token);
      });
  }

  onSubmit() {
    const newPassword = this.myForm.value.password;
    if (this.authService.attemptChangePass(newPassword, this.token)) {
      this.authService.setPassword(newPassword, this.token).subscribe(
        data => {
          this.toastService.success('Successfully set password');
          this.router.navigate(['/home']);
        },
        err => {
          this.toastService.error('Failed set password');
          if (err.message.includes('Failed to authenticate token')) {
            // console.log('Token to reset password expired');
            this.router.navigate(['']);
          }
        }
      );
    } else {
      this.authService.changePassword(newPassword, this.token).subscribe(
        data => {
          this.toastService.success('Successfully change password');
          this.router.navigate(['/home']);
        },
        err => {
          this.toastService.error('Failed change password');
          // console.log(err);
        }
      );
    }

  }

  showPassword(type: any) {
    this.isPasswordVisible[type] = !this.isPasswordVisible[type];
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  hideErrorMessage() {
    this.showError = false;
  }

  showErrorMessage() {
    this.showError = true;
  }

}
