import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { BASE_URL, DOCUMENT_TYPE } from 'src/app/core/utils/constant';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-applicant-detail',
  templateUrl: './applicant-detail.component.html',
  styleUrls: ['./applicant-detail.component.scss']
})
export class ApplicantDetailComponent implements OnInit {
  @Input() applicant;
  @Output() potentialChange = new EventEmitter;
  @Output() inviteOn = new EventEmitter;
  @Output() reject = new EventEmitter;
  @Input() inheritBackground: boolean;
  @Input() isCandidate: boolean;
  public invItems: String[] = [];
  documents = [];
  public documentType = DOCUMENT_TYPE;
  public getImageURL = "";
  constructor(
    private userService: UserService,
  ) { this.getImageURL = BASE_URL; }

  ngOnInit() {
    console.log(this.applicant);
    this.documents = [];
    // Object.keys(this.applicant.user.attachments).forEach(type => {
    //   this.documents.push({
    //     type: this.applicant.user.attachments[type],
    //     name: this.documentType[type],
    //     file: this.applicant.user.attachments[type] === undefined ? null : 'any',
    //     tempFile: null,
    //     mark: {
    //       delete: false,
    //       reupload: false,
    //       newUpload: false
    //     }
    //   });
    // });

    this.userService.getProfilePic(this.applicant.userID+ '?cacheBreak=' + new Date().getTime()).subscribe(
      response => {
        this.picChangeUser(this.blobToFile(response, 'profPic'));
      },error =>{
          // console.log(error);
      });

    if(this.applicant.status === 'APPLIED'){
      this.invItems = ["Shortlist","Test", "Interview I", "Interview II", "On Board", "Withdraw"];
    }

    if(this.applicant.status === 'SHORTLIST'){
      this.invItems = ["Test", "Interview I", "Interview II", "On Board", "Withdraw"];
    }

    if(this.applicant.status === 'TEST'){
      this.invItems = ["Interview I", "Interview II", "On Board", "Withdraw"];
    }
    if(this.applicant.status === 'INTERVIEW_1'){
      this.invItems = ["Interview II", "On Board", "Withdraw"];
    }
    if(this.applicant.status === 'INTERVIEW_2'){
      this.invItems = ["On Board", "Withdraw"];
    }
  }

  showApplicantAction(applicant: any): Boolean {
    // These status will not show any action button dropdown
    return !(["REJECTED", "HIRED", "WITHDRAWN", "ELIMINATED"].includes(applicant.status));
  }

  setPotential() {
    this.potentialChange.emit(this.applicant);
    this.applicant.potential = !this.applicant.potential;
  }

  getShortListIcon() {
    if ((this.applicant.userStatus === "POTENTIAL") || 
        (this.isCandidate && this.applicant.status === "POTENTIAL")
    ) {
      return ('assets/images/ic_shortlisted.svg');
    } else {
      return ('assets/images/ic_shortlist.svg');
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
  
  picChangeUser(thePicture: File) {
    // for picture changes
    const reader = new FileReader();
    reader.onload = e => {
      this.applicant.user.profpic = reader.result;
    };
  
    reader.readAsDataURL(thePicture);
  }

  onInvite(type){
    this.inviteOn.emit(type);
  }

  rejectApplicant() {
    this.reject.emit();
  }

}
