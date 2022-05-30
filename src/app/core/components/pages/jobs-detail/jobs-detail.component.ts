import { Component, Inject, OnInit, Input, EventEmitter, Output  } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { ApplicationService } from 'src/app/core/services/application.service';
import { JobService } from 'src/app/core/services/job.service';

import { Messages } from 'src/app/core/utils/constant';
import { JobDetailModel } from 'src/app/core/models/job.detail.model';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-jobs-detail',
  templateUrl: './jobs-detail.component.html',
  styleUrls: ['./jobs-detail.component.scss']
})
export class JobsDetailComponent implements OnInit {
  public id: string;
  public isNotFound: boolean;
  public isLoading = true;
  public isApplied: boolean;
  private appl: any;
  private curStat: any;
  private job: JobDetailModel;
  public status: any = [
    {
      name: 'Personal Info',
      status: 'complete',
      date: null
    },
    {
      name: 'Apply',
      status: 'complete',
      date: null
    },
    {
      name: 'Test',
      status: null,
      date: null
    },
    {
      name: 'Interview I',
      status: null,
      date: null
    },
    {
      name: 'Interview II',
      status: null,
      date: null
    },
    {
      name: 'On Board',
      status: null,
      date: null
    }
  ];
  public isWithdraw = false;
  public isOnBoard = false;
  public isRejected = false;

  private message: String;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private jobService: JobService) {
      this.message = Messages.JOB_NOT_FOUND;
  }

  ngOnInit() {
    // Scroll to top.
    this.document.body.scrollTop = 0;

    // 'id' is the name of the route parameter.
    this.id = this.route.snapshot.params['id'];

    // Get job detail.
    if (this.id.includes('appli')) {
      this.onGetApplicationById(this.id);
      this.isApplied = true;
    } else {
      this.onGetJobDetail(this.id);
      this.isApplied = false;
    }
  }

  onGetJobDetail(id: string) {
    this.jobService.getJobDetail(id)
      .subscribe(
        response => {
          this.job = response;
          this.isNotFound = false;
          this.isLoading = false;
        },
        error => {
          // console.log(error);
          this.isNotFound = true;
          this.isLoading = false;
        });
  }

  onGetApplicationById(id: string) {
    this.applicationService.getApplicationById(id)
    .subscribe(
      response => {
         this.job = response.job;
         this.appl = response;

        // this.job.name = job.role;
        // this.job.location = job.location;
        // this.job.onBoardStart = job.onBoardStart;
        // this.job.onBoardEnd = job.onBoardEnd;
        // this.job.language = job.language;
        // this.job.experience = job.experience;
        // this.job.education = job.education;
        // this.job.employment = job.employment;
        // this.job.description = job.jobDesc;
        // this.job.requirements = job.requirement;
        // this.job.benefits = job.benefits;
        // this.job.salary = response.expSalary;
        // this.job.negotiable = response.isNegotiable;
        // this.job.why = response.comments;

        // Job status is withdrawn or not
        const status = response.status;

        this.curStat = this.status;

        if (status === 'WITHDRAWN') {
          this.isWithdraw = true;
          // // console.log('isWithdrawn');
        } else if (status === 'HIRED') {
          this.isOnBoard = true;
        } else if (status === 'REJECTED') {
          this.isRejected = true;
          // // console.log('isNotWithdrawn');
        }

        // TODO : Status chart starts here.
        // // console.log(response);
        // // console.log(response.status);

        const record = response.auditRecords.length;
        // console.log('RECORD', record);

        if (status === 'TEST') {
          this.status[2].status = 'complete';
          this.status[3].status = 'ongoing';
        } else if (status === 'INTERVIEW_1') {
          this.status[2].status = 'complete';
          this.status[3].status = 'complete';
          this.status[4].status = 'ongoing';
        } else if (status === 'INTERVIEW_2') {
          this.status[2].status = 'complete';
          this.status[3].status = 'complete';
          this.status[4].status = 'complete';
          this.status[5].status = 'ongoing';
        } else if (status === 'HIRED') {
          this.status[2].status = 'complete';
          this.status[3].status = 'complete';
          this.status[4].status = 'complete';
          this.status[5].status = 'complete';
        } else if (status === 'WITHDRAWN' && record === 2) {
          this.status[2].status = 'withdrawn';
          this.isWithdraw = true;
          this.status.splice(3, 1);
          this.status.splice(3, 1);
          this.status.splice(3, 1);
        } else if (status === 'WITHDRAWN' && record === 3) {
          this.status[2].status = 'complete';
          this.status[3].status = 'withdrawn';
          this.isWithdraw = true;
          this.status.splice(4, 1);
          this.status.splice(4, 1);
        } else if (status === 'WITHDRAWN' && record === 4) {
          this.status[2].status = 'complete';
          this.status[3].status = 'complete';
          this.status[4].status = 'withdrawn';
          this.isWithdraw = true;
          this.status.splice(5, 1);
          this.status.splice(5, 1);
        } else if (status === 'WITHDRAWN' && record === 5) {
          this.status[2].status = 'complete';
          this.status[3].status = 'complete';
          this.status[4].status = 'complete';
          this.status[5].status = 'withdrawn';
          this.isWithdraw = true;
          this.status.splice(6, 1);
        } else if (status === 'REJECTED' && record === 1) {
          this.status[2].status = 'eliminated';
          this.isWithdraw = true;
        } else if (status === 'REJECTED' && record === 2) {
          this.status[2].status = 'eliminated';
          this.isWithdraw = true;
        } else if (status === 'REJECTED' && record === 3) {
          this.status[2].status = 'complete';
          this.status[3].status = 'eliminated';
          this.isWithdraw = true;
        } else if (status === 'REJECTED' && record === 4) {
          this.status[2].status = 'complete';
          this.status[3].status = 'complete';
          this.status[4].status = 'eliminated';
          this.isWithdraw = true;
        } else if (status === 'REJECTED' && record === 5) {
          this.status[2].status = 'complete';
          this.status[3].status = 'complete';
          this.status[4].status = 'complete';
          this.status[5].status = 'eliminated';
          this.isWithdraw = true;
        }

        // console.log(this.status);

        this.isNotFound = false;
        this.isLoading = false;
      },
      error => {
        // console.log(error);
        this.isNotFound = true;
        this.isLoading = false;
      });
  }

  onApply(status: boolean) {
    if (status) {
      if (this.id.includes('appli')) {
        this.openWithdrawDialog(this.id);
      } else {
        this.router.navigate(['jobs', this.id, 'apply']);
      }
    }
  }

  /**
   * Open withdraw dialog,
   * get data (reinitialization) when success withdraw an application.
   * @param id - application ID
   */
  openWithdrawDialog(id: string) {
    const dialogRef = this.dialogService.getWithdrawDialog(id);

    dialogRef.afterClosed().subscribe(result => {
      if (result.isWithdraw) {
        this.isWithdraw = true;
      }
    });
  }
}
