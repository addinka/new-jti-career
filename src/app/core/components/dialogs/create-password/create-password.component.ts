import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss']
})
export class CreatePasswordComponent implements OnInit {
  public isPasswordVisible: any = {
    password: false,
    confirmPassword: false
  };

  public createPasswordForm: FormGroup;
  public user: any;

  constructor(
    public dialogRef: MatDialogRef<CreatePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public _router: Router, public fb: FormBuilder) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    // Create form group.
    this.createPasswordForm = this.fb.group({
      password: [''],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });
  }

  close(next: any): void {
    this.dialogRef.close({
      next: next,
      data: { password: this.createPasswordForm.value.password }
    });
  }

  onSubmit() {
    const value = this.createPasswordForm.value;

    this.close(true);
  }

  showPassword(type: any) {
    this.isPasswordVisible[type] = !this.isPasswordVisible[type];
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;
    return pass === confirmPass ? null : { notSame: true };
  }
}
