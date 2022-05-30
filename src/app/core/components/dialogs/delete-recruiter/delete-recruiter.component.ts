import { Component, Inject } from '@angular/core';
import { RecruiterService } from 'src/app/core/services/recruiter.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-recruiter',
  templateUrl: './delete-recruiter.component.html',
  styleUrls: ['./delete-recruiter.component.scss']
})
export class DeleteRecruiterComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private recruiterService: RecruiterService,
    private toastService: ToastService,
    private dialogRef: MatDialogRef<DeleteRecruiterComponent>) {
  }

  close(bool: boolean) {
    this.dialogRef.close({ isDelete: bool });
  }

  onDeleteRecruiter() {
    const recruiter = this.data.recruiter;
    this.recruiterService.deleteRecruiter(recruiter.email)
      .subscribe(
        _ => {
          this.toastService.success(recruiter.name + ' has been deleted');
          this.close(true);
        },
        _ => {
          this.toastService.error('Failed to delete, please try again later');
        });
  }
}
