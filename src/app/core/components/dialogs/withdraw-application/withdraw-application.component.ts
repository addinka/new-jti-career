import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApplicationService } from 'src/app/core/services/application.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Message } from 'src/app/core/utils/message.mapping';

@Component({
  selector: 'app-withdraw-application',
  templateUrl: './withdraw-application.component.html',
  styleUrls: ['./withdraw-application.component.scss']
})
export class WithdrawApplicationComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private applicationService: ApplicationService,
    private toastService: ToastService,
    private dialogRef: MatDialogRef<WithdrawApplicationComponent>) {
  }

  close(bool: boolean) {
    this.dialogRef.close({ isWithdraw: bool });
  }

  onWithdraw() {
    this.applicationService.cancelApplication(this.data.id)
      .subscribe(
        _ => {
          this.toastService.success(Message.toast.withdraw.success);
          this.close(true);
        },
        _ => {
          this.toastService.error(Message.toast.withdraw.error);
          this.close(true);
        });
  }
}
