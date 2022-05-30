import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { BASE_URL } from 'src/app/core/utils/constant';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss']
})
export class ApplicantComponent implements OnInit {
  @Input() applicant;
  @Output() applicantDetailContainer = new EventEmitter;
  @Output() potentialChange = new EventEmitter;
  @Output() inviteOn = new EventEmitter;
  @Output() reject = new EventEmitter;
  public isApplicantReasonShown: Boolean = false;
  public invItems: String[] = [];
  public getImageURL:any;
  public getRecruiterImageURL:any;

  constructor(
    private userService: UserService,
  ) { this.getRecruiterImageURL = BASE_URL;}

  showApplicantAction(): Boolean {
    // These status will not show any action button dropdown
    return !(["REJECTED", "HIRED", "WITHDRAWN", "ELIMINATED"].includes(this.applicant.status));
  }

  ngOnInit() {
    // console.log(this.applicant);
    if(this.applicant.status === 'APPLIED'){
      this.invItems = ["Shortlist", "Test", "Interview I", "Interview II", "On Board"];
    }

    if(this.applicant.status === 'SHORTLIST'){
      this.invItems = ["Test", "Interview I", "Interview II", "On Board"];
    }

    if(this.applicant.status === 'TEST'){
      this.invItems = ["Interview I", "Interview II", "On Board"];
    }
    if(this.applicant.status === 'INTERVIEW_1'){
      this.invItems = ["Interview II", "On Board"];
    }
    if(this.applicant.status === 'INTERVIEW_2'){
      this.invItems = ["On Board"];
    }


      for(var i=0; this.applicant.length <= 0; i++){
        this.userService.getProfilePic(this.applicant[i].userID+ '?cacheBreak=' + new Date().getTime()).subscribe(
          response => {
            this.picChangeUser(this.blobToFile(response, 'profPic'), i);
          },error =>{
              // console.log(error);
          });
      }
  }

  getShortListIcon() {
    // console.log(this.applicant.userStatus);
    if (this.applicant.userStatus === "POTENTIAL") {
      return ('assets/images/ic_shortlisted.svg');
    } else {
      return ('assets/images/ic_shortlist.svg');
    }
  }

  setPotential() {
    this.potentialChange.emit(this.applicant);
    this.applicant.potential = !this.applicant.potential;
  }

  openApplicantReason() {
    this.isApplicantReasonShown = !this.isApplicantReasonShown;

    if (this.isApplicantReasonShown) {
      document.getElementById(this.applicant.userID).style.backgroundColor = '#598CF5';
    } else {
      document.getElementById(this.applicant.userID).style.backgroundColor = '#B3C0D3';
    }
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;
  
    // Cast to a File() type
    return theBlob as File;
  }
  
  picChangeUser(thePicture: File,i) {
    // for picture changes
    const reader = new FileReader();
    reader.onload = e => {
      this.applicant[i].user.profpic = reader.result;
    };
  
    reader.readAsDataURL(thePicture);
  }


  openApplicantDetail() {
    this.applicantDetailContainer.emit();
  }

  onInvite(type){
    this.inviteOn.emit(type);
  }

  rejectApplicant() {
    this.reject.emit();
  }

  
}
