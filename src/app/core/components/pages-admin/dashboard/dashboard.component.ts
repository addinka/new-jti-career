import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ApplicationService } from 'src/app/core/services/application.service';
import { BASE_URL } from 'src/app/core/utils/constant';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public currentDate: any;
  public currentName: string;
  public currentProfilePicture: string;

  public getImageURL: string;

  public progressItems: any;
  public countTeam: number;
  public countMe: number;

  public isTeam: boolean;
  public isMe: boolean;

  public isoDate: string;

  isError: boolean;
  message = 'Something wrong here, please try again';

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private toastService: ToastService) {
    this.currentDate = new Date();
    this.getImageURL = BASE_URL;
    this.progressItems = [];
    this.countTeam = 0;
    this.countMe = 0;
    this.isTeam = true;
    this.isMe = false;

    this.authService.getCurrentName()
      .subscribe(
        name => {
          this.currentName = name;
        }
      );

    this.authService.getCurrentProfilePicture()
      .subscribe(
        profilePicture => {
          this.currentProfilePicture = profilePicture;
        }
      );
  }

  ngOnInit() {
    this.currentName = localStorage.getItem('name');
    this.currentProfilePicture = localStorage.getItem('profilePicture');
    // console.log(this.currentProfilePicture)

    const year = this.currentDate.getFullYear();
    let month = this.currentDate.getMonth() + 1;
    let date = this.currentDate.getDate();

    if (date.toString().length === 1) {
      date = '0' + date;
    }
    if (month.toString().length === 1) {
      month = '0' + month;
    }
    this.isoDate = year + '-' + month + '-' + date;

    this.resetProgressItem();
    this.onGetApplicationByDate(this.isoDate, this.isTeam);
    // this.onGetApplicationByDate('2019-10-1', this.isTeam);
  }

  pushProgressItems(response: any, isTeam: boolean, index: number) {
    if (response) {
      response.forEach((element: any) => {
        const inviteTime = new Date(element.inviteTime);
        if (isTeam) {
          this.progressItems[index].detail.push({
            startHour: inviteTime,
            candidateName: element.userName,
            candidateRole: element.jobTitle,
            recruiterInCharge: element.recruiterName
          });
          this.progressItems[index].count += 1;
        } else if (!isTeam && this.currentName === element.recruiterName) {
          this.progressItems[index].detail.push({
            startHour: inviteTime,
            candidateName: element.userName,
            candidateRole: element.jobTitle,
            recruiterInCharge: element.recruiterName
          });
          this.progressItems[index].count += 1;
        }
        if (this.currentName === element.recruiterName) {
          this.countMe += 1;
        }
        this.countTeam += 1;
      });
      if (this.progressItems[index].detail.length === 0) {
        this.progressItems[index].detail.push({});
      }
    } else {
      this.progressItems[index].detail.push({});
    }
  }

  onGetApplicationByDate(date: string, isTeam: boolean) {
    this.applicationService.getApplicationByDate(date)
      .subscribe(
        response => {
          // TEST
          this.pushProgressItems(response.TEST, isTeam, 0);

          // INTERVIEW 1
          this.pushProgressItems(response.INTERVIEW_1, isTeam, 1);

          // INTERVIEW 2
          this.pushProgressItems(response.INTERVIEW_2, isTeam, 2);

          // ONBOARD
          this.pushProgressItems(response.HIRED, isTeam, 3);
        },
        error => {
          // console.log(error);
          this.isError = true;
        });
  }

  onSelectDate(iso: string) {
    this.resetProgressItem();
    this.onGetApplicationByDate(iso, this.isTeam);
    this.isoDate = iso;

    const month = Number(iso.substring(5, 7)) - 1;
    this.currentDate = new Date(iso).setMonth(month);
  }

  resetProgressItem() {
    this.countTeam = 0;
    this.countMe = 0;
    this.progressItems = [];
    this.progressItems.push(
      {
        name: 'Test',
        count: 0,
        detail: []
      },
      {
        name: 'Interview I',
        count: 0,
        detail: []
      },
      {
        name: 'Interview II',
        count: 0,
        detail: []
      },
      {
        name: 'Onboarding',
        count: 0,
        detail: []
      });
  }

  onChangeTeam() {
    if (!this.isTeam) {
      this.isTeam = true;
      this.isMe = false;
      this.resetProgressItem();
      this.onGetApplicationByDate(this.isoDate, this.isTeam);
    }
  }

  onChangeMe() {
    if (!this.isMe) {
      this.isMe = true;
      this.isTeam = false;
      this.resetProgressItem();
      this.onGetApplicationByDate(this.isoDate, this.isTeam);
    }
  }

  /* onComingSoon() {
    this.toastService.info('Please try again later');
  } */

  onError() {
    this.isError = true;
  }
}
