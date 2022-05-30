import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { RegexMapping } from 'src/app/core/utils/regex.mapping';
import { Message } from 'src/app/core/utils/message.mapping';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  public resetForm: FormGroup;
  showError: Boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ResetPasswordComponent>,
    private authService: AuthService,
    private toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: any, public _router: Router, public fb: FormBuilder) {
    dialogRef.disableClose = true;
    this.resetForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern(RegexMapping.EMAIL_VALIDATOR)
      ])]
    });
  }

  close(openLogin: boolean) {
    this.dialogRef.close({ next: openLogin });
  }

  onSubmit() {
    const data = this.resetForm.value;

    this.authService.requestResetPassword(data.email)
      .subscribe(
        response => {
          this.toastService.success(Message.toast.reset.success);
          this.close(false);
        },
        error => {
          this.toastService.error(Message.toast.reset.error);
        });
  }

  hideErrorMessage() {
    this.showError = false;
  }

  showErrorMessage() {
    this.showError = true;
  }
}
