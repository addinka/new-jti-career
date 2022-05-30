import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApplicationService } from 'src/app/core/services/application.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Message } from 'src/app/core/utils/message.mapping';

@Component({
  selector: 'app-reject-application',
  templateUrl: './reject-application.component.html',
  styleUrls: ['./reject-application.component.scss']
})
export class RejectApplicationComponent {

  status: string = "rejected";
  remarks: FormControl;
  rejection_status = {
    rejected: "reject",
    withdrawn: "withdraw",
    eliminated: "eliminate"
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private applicationService: ApplicationService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RejectApplicationComponent>) {
      if (data.status) this.status = data.status;
      this.remarks = this.fb.control('');
  }

  close(bool: boolean) {
    this.dialogRef.close({ isEliminate: bool, next: bool });
  }

  onEliminate() {
    this.applicationService.cancelApplication(this.data.id, this.status, this.remarks.value)
      .subscribe(
        _ => {
          this.toastService.success(Message.toast.eliminate.success);
          this.close(true);
        },
        _ => {
          this.toastService.error(Message.toast.eliminate.error);
          this.close(true);
        });
  }
}
