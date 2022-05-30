import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Overlay } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BASE_URL } from 'src/app/core/utils/constant';
import { ApplicationService } from 'src/app/core/services/application.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserService } from 'src/app/core/services/user.service';
import { AttrAst } from '@angular/compiler';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  public inviteForm: FormGroup;
  public getImageURL: string;
  public minInviteDate = new Date();

  public hours = [];
  public selectedInviteHour: string = "09:00";
  public selectedEndHour: string = "09:00";

  public type: string;

  types: string[];
  rooms: string[];
  selectedRoom: string;
  addresses: string[];
  selectedAddress: string;

  sendBlueformCheck: FormControl;
  sendOnboardformCheck: FormControl;

  attachments: File[] = [];

  constructor(
    private dialogRef: MatDialogRef<InviteComponent>,
    private applicationService: ApplicationService,
    private userService: UserService,
    private toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder) {
    dialogRef.disableClose = true;
    this.getImageURL = BASE_URL;
    this.inviteForm = this.fb.group({
      appliID: [data.appliID, [Validators.required]],
      inviteTime: [this.minInviteDate, [Validators.required]],
      endTime: [this.minInviteDate],
      inviteType: ['', [Validators.required]],
      inviteCode: [''],
      // invitePassword: [''],
      inviteLink: [''],
      inviteNotes: [''],
      inviteRoom: [''],
      inviteRoomCustom: [''],
      inviteAddress: [''],
      inviteAddressCustom: [''],
    });

    this.sendBlueformCheck = this.fb.control(false);
    if (data.blueFormFilled) {
      this.sendBlueformCheck.setValue(true);
      this.sendBlueformCheck.disable();
    }

    this.sendOnboardformCheck = this.fb.control(false);

    this.rooms = [
      'Raja Ampat', 'Borobudur 1', 'Borobudur 2', 'Tana Toraja', 'Bunaken', 'Add New'
    ];

    this.types = [
      'Offline', 'Online'
    ];
    this.selectedRoom = this.rooms[0];

    this.addresses = [
      // tslint:disable-next-line: max-line-length
      'The Plaza Office Tower, 16th Floor, Jl. M.H.Thamrin Kav. 28-30 Jakarta 10350, RT.9/RW/5, Gondangdia, Jakarta, Central Jakarta City, Jakarta 10350', 'Add New'
    ];
    this.selectedAddress = this.addresses[0];
  }

  ngOnInit() {
    this.setType();
    // this.setInviteHour();
  }

  setType() {
    switch (this.data.type) {
      case 'Test':
        this.type = 'test';
        break;
      case 'Interview I':
        this.type = 'inter1';
        break;
      case 'Interview II':
        this.type = 'inter2';
        break;
      case 'On Board':
        this.type = 'onboard';
        break;
      default:
        break;
    }

    // console.log(this.type)
  }

  close(next: boolean) {
    this.dialogRef.close({next: next});
  }

  handleFileInput(files) {
    // console.log(this.attachments);
    for (var i = 0; i < files.length; i++) {
      this.attachments.push(files[i]);
    }
  }

  removeFile(index: number) {
    this.attachments = [...this.attachments.slice(0, index), ... this.attachments.slice(index+1)]
  }

  setEndHour(value: any) {
    console.log(value)
    this.selectedEndHour = value;
  }

  setInviteHour(value: any) {
    console.log(value)
    this.selectedInviteHour = value;
  }

  onCancelRoom() {
    this.inviteForm.patchValue({ inviteRoom: '' });
    this.inviteForm.patchValue({ inviteRoomCustom: '' });
    this.inviteForm.controls['inviteRoom'].setValidators([Validators.required]);
    this.inviteForm.controls['inviteRoomCustom'].clearValidators();
    this.inviteForm.controls['inviteRoom'].updateValueAndValidity();
    this.inviteForm.controls['inviteRoomCustom'].updateValueAndValidity();
  }

  onCancelAddress() {
    this.inviteForm.patchValue({ inviteAddress: '' });
    this.inviteForm.patchValue({ inviteAddressCustom: '' });
    this.inviteForm.controls['inviteAddress'].setValidators([Validators.required]);
    this.inviteForm.controls['inviteAddressCustom'].clearValidators();
    this.inviteForm.controls['inviteAddress'].updateValueAndValidity();
    this.inviteForm.controls['inviteAddressCustom'].updateValueAndValidity();
  }

  onSelectType(event: any) {
    // console.log(event);
    if (event === 'Offline') {
      // Set Validators
      this.inviteForm.controls['inviteRoom'].setValidators([Validators.required]);
      this.inviteForm.controls['inviteAddress'].setValidators([Validators.required]);
      this.inviteForm.controls['inviteCode'].clearValidators();
      this.inviteForm.controls['inviteLink'].clearValidators();

      // Update Validators
      this.inviteForm.controls['inviteRoom'].updateValueAndValidity();
      this.inviteForm.controls['inviteAddress'].updateValueAndValidity();
      this.inviteForm.controls['inviteCode'].updateValueAndValidity();
      this.inviteForm.controls['inviteLink'].updateValueAndValidity();

      // Update Value
      this.inviteForm.controls['inviteCode'].setValue('');
      this.inviteForm.controls['inviteLink'].setValue('');
      this.inviteForm.controls['inviteNotes'].setValue('');
    }else{

      if(this.type == 'test'){
        this.inviteForm.controls['inviteCode'].setValidators([Validators.required]);
      } 

      // Set Validators
      this.inviteForm.controls['inviteLink'].setValidators([Validators.required]);
      this.inviteForm.controls['inviteRoom'].clearValidators();
      this.inviteForm.controls['inviteAddress'].clearValidators();

      // Update Validators
      this.inviteForm.controls['inviteCode'].updateValueAndValidity();
      this.inviteForm.controls['inviteLink'].updateValueAndValidity();
      this.inviteForm.controls['inviteRoom'].updateValueAndValidity();
      this.inviteForm.controls['inviteAddress'].updateValueAndValidity();

      // Update Value
      this.inviteForm.controls['inviteRoom'].setValue('');
      this.inviteForm.controls['inviteAddress'].setValue('');
    

    }
  }

  onSelectRoom(event: any) {
    if (event === 'Add New') {
      this.inviteForm.controls['inviteRoomCustom'].setValidators([Validators.required]);
      this.inviteForm.controls['inviteRoom'].clearValidators();
      this.inviteForm.controls['inviteRoomCustom'].updateValueAndValidity();
      this.inviteForm.controls['inviteRoom'].updateValueAndValidity();
    }
  }

  onSelectAddress(event: any) {
    if (event === 'Add New') {
      this.inviteForm.controls['inviteAddressCustom'].setValidators([Validators.required]);
      this.inviteForm.controls['inviteAddress'].clearValidators();
      this.inviteForm.controls['inviteAddressCustom'].updateValueAndValidity();
      this.inviteForm.controls['inviteAddress'].updateValueAndValidity();
    }
  }

  onSubmit() {
    console.log(this.selectedInviteHour);
    const inviteTime = this.inviteForm.get('inviteTime').value;
    inviteTime.setHours(this.selectedInviteHour.substring(0,2), this.selectedInviteHour.substring(3), 0, 0);
    this.inviteForm.patchValue({ inviteTime: inviteTime });

    const endTime = this.inviteForm.get('endTime').value;
    endTime.setHours(this.selectedEndHour.substring(0,2), this.selectedEndHour.substring(3), 0, 0);
    this.inviteForm.patchValue({ endTime: endTime });

    const inviteRoom = this.inviteForm.get('inviteRoom').value;
    const inviteAddress = this.inviteForm.get('inviteAddress').value;
    const inviteRoomCustom = this.inviteForm.get('inviteRoomCustom').value;
    const inviteAddressCustom = this.inviteForm.get('inviteAddressCustom').value;

    if (inviteRoom === 'Add New') {
      this.inviteForm.patchValue({ inviteRoom: inviteRoomCustom });
    }
    if (inviteAddress === 'Add New') {
      this.inviteForm.patchValue({ inviteAddress: inviteAddressCustom });
    }

    let data;

    if(this.inviteForm.value.inviteType === 'Online'){
      if(this.type === 'test'){
        data = {
          appliID: this.inviteForm.value.appliID,
          inviteTime: this.inviteForm.value.inviteTime,
          inviteLink: this.inviteForm.value.inviteLink,
          inviteCode: this.inviteForm.value.inviteCode,
          inviteNotes: this.inviteForm.value.inviteNotes,
          endTime: this.inviteForm.value.endTime
        }
      } else {
        data = {
          appliID: this.inviteForm.value.appliID,
          inviteTime: this.inviteForm.value.inviteTime,
          inviteLink: this.inviteForm.value.inviteLink,
          inviteNotes: this.inviteForm.value.inviteNotes
        }
      }

      this.type = this.type + '_online';
      
    }else{
      data = {
        appliID: this.inviteForm.value.appliID,
        inviteTime: this.inviteForm.value.inviteTime,
        inviteRoom: this.inviteForm.value.inviteRoom,
        inviteAddress: this.inviteForm.value.inviteAddress,
      }
    }

    // console.log('type', this.type)
    let request: (formData: FormData)=>Observable<any>;
    if (this.sendOnboardformCheck.value) {
      console.log("onboard form")
      data['origin'] = 'onboard';
      data['type'] = this.type;
      data['jobID'] = this.data.jobID;
      data['userID'] = this.data.userID;
      request = (formData) => this.userService.sendOnboardFormWithInvite(formData);
    } else if (
      (this.sendBlueformCheck.value && this.sendBlueformCheck.enabled)
      || this.data.fromBlueForm
    ) { // Sending blueform
      data['jobID'] = this.data.jobID;
      data['userID'] = this.data.userID;
      data['origin'] = 'blueform';
      data['type'] = this.type;
      if(this.data.fromBlueForm) delete data.appliID; // dont need this on blueform
      request = (formdata) => this.userService.sendBlueForm(formdata);
      // console.log("buform")
    } else {
      // console.log("buform nottt")
      request = (formdata) => this.applicationService.inviteCandidate(this.type, formdata);
    }
    console.log('data', data);
    const formData = new FormData();
    Object.keys(data).forEach(key=>{
      formData.append(key, data[key]);
    })
    this.attachments.forEach(file=>{
      formData.append("attachment", file, file.name);
    })
    request(formData).subscribe(
      _response => {
        this.toastService.success('Invitation has been sent to candidate\'s email & notification');
        this.close(true);
      },
      error => {
        this.toastService.error(error.error.message);
        this.close(false);
      });
  }
}
