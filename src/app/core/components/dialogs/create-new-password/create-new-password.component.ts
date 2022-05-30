import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.scss']
})
export class CreateNewPasswordComponent {
  isPasswordVisible: any = {
    password: false,
    confirmPassword: false
  };
  myForm: FormGroup;
  showError: Boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateNewPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public _router: Router, public fb: FormBuilder) {
    dialogRef.disableClose = true;
    this.myForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });
  }
  close(next: any): void {
    this.dialogRef.close({ next: next });
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
