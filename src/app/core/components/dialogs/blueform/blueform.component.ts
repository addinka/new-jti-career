import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from 'src/app/core/services/job.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserService } from 'src/app/core/services/user.service';
import { Arrays } from 'src/app/core/utils/constant';
import { InviteComponent } from '../invite/invite.component';
import { Overlay } from '@angular/cdk/overlay';
// import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-send-blue-form',
  templateUrl: './blueform.component.html',
  styleUrls: ['./blueform.component.scss']
})
export class SendBlueFormComponent implements OnInit {
  public inviteForm: FormGroup;

  jobList: any[];
  invTypeList = Arrays.INVITATION.slice(1,-1);

  constructor(
    private dialogRef: MatDialogRef<SendBlueFormComponent>,
    // private userService: UserService,
    private jobService: JobService,
    private matDialog: MatDialog,
    private overlay: Overlay,
    // private toastService: ToastService,
    // private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder) {
    dialogRef.disableClose = true;
    // // console.log(data)
    this.inviteForm = this.fb.group({
      userID: [data.candidateID, [Validators.required]],
      jobID: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });
    this.inviteForm.disable();
  }

  ngOnInit() {
    this.getJobList();
  }

  getJobList() {
    this.jobService
    // .getJobs("", "")
    .getAvailableJobs()
    .subscribe(res=>{
      // console.log(res)
      this.jobList = res.rows;
      this.inviteForm.enable();
    },
    err=>{
      console.error(err);
    })
  }

  close(next: boolean) {
    this.dialogRef.close({next: next});
  }

  get formValid(): boolean {
    return this.inviteForm.valid && this.inviteForm.enabled
  }

  onSubmit() {

    const formData = this.inviteForm.value;
    // // console.log(data);
    // this.userService.sendBlueForm(data)
    //   .subscribe(
    //     _response => {
    //       this.toastService.success('Blue Form filling invitation has been sent to candidate\'s email & notification');
    //       this.close(true);
    //     },
    //     error => {
    //       this.toastService.error(error.error.message);
    //       this.close(false);
    //     });
    const data = {
      ...formData,
      profpic: this.data.profpic,
      name: this.data.name,
      fromBlueForm: true,
      appliID: '_'
    }
    const secondDialogRef = this.matDialog.open(InviteComponent, {
      data,
      width: '468px',
      backdropClass: 'backgroundBlur',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    })
    secondDialogRef.afterClosed().subscribe(resp=>{
      this.dialogRef.close(resp);
    })
    // const secondDialogRef = this.dialogService.getInviteCandidateDialog(formData.type, data, true)
  }

  dateString(date: string) {
    const result = new Date(date);
    if (result.toString() === 'Invalid Date') return "";
    return result;
  }

  notDateString(type: string) {
    switch(type) {
      case 'I':
        return "Immediately";
      case 'F':
        return "Anytime";
      default: 
        return "";
    }
  }
}
