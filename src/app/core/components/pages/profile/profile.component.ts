import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sort } from '@angular/material';

import { ApplicationService } from 'src/app/core/services/application.service';
import { UserService } from 'src/app/core/services/user.service';

import { PROFILE_URL, Arrays, DOCUMENT_TYPE } from 'src/app/core/utils/constant';

import { Application } from 'src/app/core/models/application.model';
import { User } from 'src/app/core/models/user.model';

import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public basicSets: string[] = [
    'cv', 'portfolio'
  ];
  public advancedSets: string[] = [
    'idcard', 'familycard', 'educert', 'transcript', 'birthcert', 'marriagecert', 'bpjs', 'npwp', 'bankaccount', 'refletter', 'skck'
  ];
  public documentType = DOCUMENT_TYPE;

  docs: any = {
    basicSets: {
      saveChanges: false,
      editable: false,
      doc: [],
    },
    advancedSets: {
      saveChanges: false,
      editable: false,
      doc: [],
    }
  };
  public applicationStatus = {
    APPLIED: 'applied',
    SHORTLIST: 'applied',
    TEST: 'test',
    INTERVIEW_1: 'interview I',
    INTERVIEW_2: 'interview II',
    ON_BOARD: 'on board',
    WITHDRAWN: 'withdrawn',
    REJECTED: 'rejected',
    HIRED: 'hired',
    ELIMINATED: 'eliminated'
  };
  public userData: any;
  user: User;
  sortedData: any[];

  public myApplications: Application[] = [];
  public sortedApplications: Application[];
  public entriesCount = 0;
  public applicationsCount = 0;
  public myApplicationsStatusCount = [];
  public page = '1';
  public selects: string[] = Arrays.ENTRY;
  public select = this.selects[0];
  public pagesCount = 0;
  public sortTypes: string[] = [
    'default', 'asc', 'dsc'
  ];
  public sorts: string[] = [
    this.sortTypes[0],
    this.sortTypes[0],
    this.sortTypes[0],
    this.sortTypes[0],
    this.sortTypes[0],
    this.sortTypes[0]
  ];

  public profileURL: any;

  constructor(
    private applicationService: ApplicationService,
    private dialog: DialogService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    // if (!this.cookieService.check('token')) {
    //   this.router.navigate(['']);
    // } else {
    //   this.getProfile();
    //   this.getApplications(this.page, this.selects[0]);
    // }

    this.getProfile();
    this.getApplications(this.page, this.selects[0]);
  }

  onSelect(value: any) {
    this.select = value;
    this.getApplications('1', value);
  }

  disableWithdraw(application: any): Boolean {
    // These status will not show any action button dropdown
    return (["REJECTED", "HIRED", "WITHDRAWN", "ELIMINATED"].includes(application.status));
  }

  getProfile() {
    this.userService.getProfile().toPromise()
      .then(
        data => {
          this.userData = data;
          console.log(this.userData);
          // tslint:disable-next-line: prefer-const
          let companyName = [], position = [], jobdesk = [], startPeriod = [], endPeriod = [];
          for (let i = 0; i < data['workExperience'].length; i++) {
            companyName.push(data['workExperience'][i].companyName);
            position.push(data['workExperience'][i].position);
            jobdesk.push(data['workExperience'][i].jobdesk);
            startPeriod.push(data['workExperience'][i].startPeriod);
            endPeriod.push(data['workExperience'][i].endPeriod);
          }

          this.user = new User(
            data['name'],
            data['email'],
            data['contact'],
            data['linkedinURL'],
            data['domicile'],
            data['university'],
            data['majorField'],
            companyName,
            position,
            jobdesk,
            startPeriod,
            endPeriod,
            data['language'],
            data['degree'],
            data['experience'],
            data['selfDesc'],
            data['qualification'],
            data['lastUpdate'],
            data['type'],
            data['userID'],
            data['attachments'],
            data['encryptedPass'],
            data['notifications']);
          // console.log(this.user);

          // Remove documents in basic sets
          this.docs.basicSets.doc = [];

          // Add documents to basic sets
          this.basicSets.forEach(type => {
            this.docs.basicSets.doc.push({
              type: type,
              name: this.documentType[type],
              file: this.user.attachments[type] === undefined ? null : 'any',
              tempFile: null,
              mark: {
                delete: false,
                reupload: false,
                newUpload: false
              }
            });
          });
          // console.log('Basic Sets: ', this.docs.basicSets);

          // Remove documents in advanced sets
          this.docs.advancedSets.doc = [];

          // Add documents to advanced sets
          this.advancedSets.forEach(type => {
            this.docs.advancedSets.doc.push({
              type: type,
              name: this.documentType[type],
              file: this.user.attachments[type] === undefined ? null : 'any',
              tempFile: null,
              mark: {
                delete: false,
                reupload: false,
                newUpload: false
              }
            });
          });

          // console.log('Advanced Sets: ', this.docs.advancedSets);

          // Set profile picture url.

          // bypass browser cache
          // this.profileURL = PROFILE_URL + this.user.email + '?cacheBreak=' + new Date().getTime();

          let id = this.user.email + '?cacheBreak=' + new Date().getTime();

          this.userService.getProfilePic(this.user.email+ '?cacheBreak=' + new Date().getTime()).subscribe(
            response => {
              this.picChangeAlumni(this.blobToFile(response, 'profPic'));
            },error =>{
                // console.log(error);
            });
          }
      )
      .catch(
        err => {
          // console.log('err', err);
          if (err.message.includes('Failed to authenticate token')) {
            this.router.navigate(['']);
          }
        });
  }

  getApplications(page: string, entries: string) {
    this.userService.getApplications(page, entries).toPromise()
      .then(
        applications => {
          const data = applications.rows;

          // console.log(data);
          // Set applications count.
          this.applicationsCount = applications.total_rows;

          // Reinitialize applications and entries count.
          this.myApplications = [];
          this.sortedApplications = [];
          this.entriesCount = 0;

          // Push application.
          data.forEach(element => {
            const el = element.value;

            if (!el.applicationID) {
              return;
            }

            this.myApplications.push(new Application(
              el.applicationID,
              el.jobID,
              el.userID,
              el.job,
              el.expSalary,
              el.isNegotiable,
              el.comments,
              el.status,
              el.auditRecords,
              el.lastUpdated
            ));

            this.sortedApplications = this.myApplications.slice();

            this.entriesCount += 1;

            this.pagesCount = Math.ceil(this.applicationsCount / Number(this.select));
          });

          // Set applications status count
          this.myApplicationsStatusCount = [];
          const statusType = [
            'APPLIED', 'TEST', 'INTERVIEW_1', 'INTERVIEW_2', 'HIRED', 'WITHDRAWN', 'ELIMINATED', 'REJECTED',
          ];
          statusType.forEach(status => {
            this.myApplicationsStatusCount.push(
              {
                status: this.applicationStatus[status],
                // tslint:disable-next-line: max-line-length
                total: applications.statusCount.filter(s => s.key[1] === status).length === 0 ? 0 : applications.statusCount.filter(s => s.key[1] === status)[0].value
              }
            );
          });
          // console.log('myApplicationsStatusCount: ', this.myApplicationsStatusCount);
        },
      )
      .catch(
        err => {
          // console.log('err', err);
          if (err.message.includes('Failed to authenticate token')) {
            this.router.navigate(['']);
          }
        });
  }

  onPages(page: string) {
    this.getApplications(page, this.select);
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    // Cast to a File() typ e
    return theBlob as File;
  }

  onBoardLink(){
    console.log(this.userData);
    if(this.userData.onboardForm !== undefined){
      this.router.navigate(['/submit-onboarding-form'], {queryParams: {status: this.userData.onboardForm.status, id: this.userData.onboardForm.id}});
    }else{
      if(this.userData.blueform !== undefined){
        this.router.navigate(['/submit-onboarding-form'], {queryParams: {status: 'new', id: this.userData.blueform.id}});
      }else{
        this.router.navigate(['/submit-onboarding-form'], {queryParams: {status: 'new-profile'}});
      }
      
    }
    
  }

  picChangeAlumni(thePicture: File) {
    // for picture changes
    const reader = new FileReader();
    reader.onload = e => {
      this.profileURL = reader.result;
    };

    reader.readAsDataURL(thePicture);
  }

  /**
   * Open withdraw dialog,
   * get data (reinitialization) when success withdraw an application.
   * @param id - application ID
   */
  openWithdrawDialog(id: string) {
    const dialogRef = this.dialog.getWithdrawDialog(id);

    dialogRef.afterClosed().subscribe(result => {
      if (result.isWithdraw) {
        this.getApplications(this.page, this.selects[0]);
      }
    });
  }

  saveDocumentChanges(setType: any, saveChanges: boolean) {
    this.docs[setType].editable = !this.docs[setType].editable;
    this.docs[setType].saveChanges = saveChanges;

    //  Refresh user data after 8 seconds
    // setTimeout(() => {
    //   // console.log('Refresh User Data');
    //   this.getProfile();
    // }, 8000);
  }

  enableEdit(setType: any) {
    this.docs[setType].editable = !this.docs[setType].editable;
  }

  sortData(sort: Sort) {
    const data = this.myApplications.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedApplications = data;
      return;
    }

    this.sortedApplications = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'role': return compare(a.job.title, b.job.title, isAsc);
        case 'date':
          if (isAsc) {
            return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          } else {
            return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
          }
        case 'experience': return compare(a.job.experience, b.job.experience, isAsc);
        case 'location': return compare(a.job.location, b.job.location, isAsc);
        case 'onBoard':
          if (isAsc) {
            return new Date(a.job.onBoardStart).getTime() - new Date(b.job.onBoardStart).getTime();
          } else {
            return new Date(b.job.onBoardStart).getTime() - new Date(a.job.onBoardStart).getTime();
          }
        case 'status': return compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

  onSortArrow(sort: string, index: number) {
    // Set to default.
    this.sorts.forEach((_, i) => {
      this.sorts[i] = 'default';
    });

    switch (sort) {
      case this.sortTypes[0]:
        this.sorts[index] = this.sortTypes[1];
        break;
      case this.sortTypes[1]:
        this.sorts[index] = this.sortTypes[2];
        break;
      case this.sortTypes[2]:
        this.sorts[index] = this.sortTypes[0];
        break;
      default:
        break;
    }
  }

  onScrollToApplications() {
    document.getElementById('title-app').scrollIntoView({
      behavior: 'smooth'
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
