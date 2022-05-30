import { Component, Inject, OnInit } from '@angular/core';
import { ENTER, SPACE} from '@angular/cdk/keycodes';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { JobService } from 'src/app/core/services/job.service';
import {MatChipInputEvent} from '@angular/material/chips';
import { SendBlueFormComponent } from '../blueform/blueform.component';
import { ToastService } from 'src/app/core/services/toast.service';
import { RecruiterService } from 'src/app/core/services/recruiter.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-invite-external',
  templateUrl: './invite-external.component.html',
  styleUrls: ['./invite-external.component.scss']
})
export class InviteExternalComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, SPACE];
  public inviteForm: FormGroup;
  jobList: any[];

  constructor(
    private dialogRef: MatDialogRef<InviteExternalComponent>,
    private userService: UserService,
    private toastService: ToastService,
    private jobService: JobService,
    private matDialog: MatDialog,
    // @Inject(MAT_DIALOG_DATA) public data: any, 
    public fb: FormBuilder
  ) {
    // dialogRef.disableClose = true;
    this.inviteForm = this.fb.group({
      email: this.fb.array([], [Validators.required]),
      jobID: ['', [Validators.required]],
    });
  }

  get emails():string[] {
    return this.inviteForm.get("email").value;
  }

  get formValid(): boolean {
    return this.inviteForm.valid && this.inviteForm.enabled
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

  addEmail(event: MatChipInputEvent) {
    console.log(event)
    const value = (event.value || '').trim();
    if (value) {
      (<FormArray>this.inviteForm.get('email')).push(new FormControl(value));
    };
    event.input.value = "";
  }

  removeEmail(index:number) {
    (<FormArray>this.inviteForm.get('email')).removeAt(index);
  }

  close(next: boolean) {
    this.dialogRef.close({next: next});
  }

  onSubmit() {
    const formData = this.inviteForm.value;
    console.log(formData);
    this.userService.inviteToApply(formData)
      .subscribe(
        response => {
          console.log(response)
          if (response.alreadyExists && response.alreadyExists.length > 0) {
            this.toastService.info(`Few email has already have an account: ${response.alreadyExists.join(", ")}`);
          }
          
          if (response.signUpMail && response.signUpMail.accepted.length > 0) {
            this.toastService.success(`Invitation to apply has been sent to ${response.signUpMail.accepted.length} candidate\'s email`);
          }

          this.close(true);
        },
        error => {
          this.toastService.error(error.error.message);
          this.close(false);
        });
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
