import { Sort, MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { Arrays, BASE_URL } from 'src/app/core/utils/constant';
import { RecruiterService } from 'src/app/core/services/recruiter.service';
import { Doc } from 'src/app/core/models/new-recruiter.model';
import { InviteComponent } from '../../dialogs/invite/invite.component';
import { Overlay } from '@angular/cdk/overlay';

import { ApplicationService } from 'src/app/core/services/application.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { JobService } from 'src/app/core/services/job.service';
import { ApplicantListComponent } from './components/applicant-list/applicant-list.component';

@Component({
  selector: 'app-jobs-ads-detail',
  templateUrl: './jobs-ads-detail.component.html',
  styleUrls: ['./jobs-ads-detail.component.scss']
})
export class JobsAdsDetailComponent implements OnInit {
  public currentName: string;
  public currentId: string;

  public stsItems = [];
  public filItems = [];
  public entItems = [];
  public invItems = [];

  public applicationStatus = {
    APPLIED: 'applied',
    SHORTLIST: 'shortlisted',
    TEST_PASSED: 'test',
    INTER1_PASSED: 'interview 1',
    INTER2_PASSED: 'interview 2',
    ON_BOARD: 'on board',
    ELIMINATED: 'eliminated',
    REJECTED: 'rejected',
    WITHDRAWN: 'withdrawn'
  };
  public applicationsStatusCount = [
    {
      status: 'APPLIED',
      total: 0,
      isClicked: false
    },
    {
      status: 'SHORTLIST',
      total: 0,
      isClicked: false
    },
    {
      status: 'TEST_PASSED',
      total: 0,
      isClicked: false
    },
    {
      status: 'INTER1_PASSED',
      total: 0,
      isClicked: false
    },
    {
      status: 'INTER2_PASSED',
      total: 0,
      isClicked: false
    },
    {
      status: 'ON_BOARD',
      total: 0,
      isClicked: false
    },
    {
      status: 'WITHDRAWN',
      total: 0,
      isClicked: false
    },
    {
      status: 'ELIMINATED',
      total: 0,
      isClicked: false
    },
    {
      status: 'REJECTED',
      total: 0,
      isClicked: false
    }
  ];


  // Route parameters.
  public id: string;
  public status: string;

  // Common variables.
  public jobTitle: string;
  public selectedStatus: string;
  public selectedStatusCount: number;

  public data: any = [];
    public status2: string = '';

  jobsCount = 0;
  entriesCount = 0;
  select: string;

  isNoData = false;
  message = 'No Data Found';

  @ViewChild(ApplicantListComponent) applicantList: ApplicantListComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private jobService: JobService,
    private location: Location) {

    // this.getRecruiterImageURL = BASE_URL;

    this.stsItems = Arrays.STATUS;
    this.filItems = Arrays.FILTER;
    this.entItems = Arrays.ENTRY;
    this.select = this.entItems[0];
  }

  ngOnInit() {
    // Get route parameters
    this.id = this.route.snapshot.params['id'];
    this.status = this.route.snapshot.params['status'];
    // Route to not found page if status invalid
    if (this.stsItems.indexOf(this.status) === -1) {
      this.router.navigateByUrl('/not-found');
    } else {
      if(this.status === 'inter1'){
        this.status2 = 'INTERVIEW_1';
      }
      else if(this.status === 'inter2'){
        this.status2 = 'INTERVIEW_2';
      }else{
        this.status2 = this.status;
      }

      this.applicantList.applicationStatus = this.status2;
      this.applicantList.currentName = localStorage.getItem('name') + ' (Me)';
      this.applicantList.processedBy = this.currentName;
      this.applicantList.currentId = localStorage.getItem('id');
      // this.applicantList.cameFromSearch = true;
  
      // this.onGetJobById(param);
      // this.applicationService.onInitFilterEmitter().emit();

      // if (this.status !== 'applied') {
      //   this.getRecruiters();
      // }

      // this.getInvitationDropdown();
    }
  }

  onGetJobById(param?) {
    // this.applicantList.triggerFetch();
    this.data = [];
    
    this.jobService.getJobDetail(this.id)
      .subscribe(res => {
        // console.log(res);
        this.jobTitle = res.title;
        this.applicationsStatusCount[0].total = res.appliCount.count_applied;
        this.applicationsStatusCount[1].total = res.appliCount.count_shortlist;
        this.applicationsStatusCount[2].total = res.appliCount.count_test;
        this.applicationsStatusCount[3].total = res.appliCount.count_inter1;
        this.applicationsStatusCount[4].total = res.appliCount.count_inter2;
        this.applicationsStatusCount[5].total = res.appliCount.count_hired;
        this.applicationsStatusCount[6].total = res.appliCount.count_withdrawn;
        this.applicationsStatusCount[7].total = res.appliCount.count_eliminated;
        this.applicationsStatusCount[8].total = res.appliCount.count_rejected;

        if(this.status === 'applied'){
          this.selectedStatusCount = this.applicationsStatusCount[0].total;
        }else if(this.status === 'shortlist'){
          this.selectedStatusCount = this.applicationsStatusCount[1].total;
        }else if(this.status === 'test'){
          this.selectedStatusCount = this.applicationsStatusCount[2].total;
        }else if(this.status === 'inter1'){
          this.selectedStatusCount = this.applicationsStatusCount[3].total;
        }else if(this.status === 'inter2'){
          this.selectedStatusCount = this.applicationsStatusCount[4].total;
        }else if(this.status === 'hired'){
          this.selectedStatusCount = this.applicationsStatusCount[5].total;
        }else if(this.status === 'withdrawn'){
          this.selectedStatusCount = this.applicationsStatusCount[6].total;
        }else if(this.status === 'eliminated'){
          this.selectedStatusCount = this.applicationsStatusCount[7].total;
        }else if(this.status === 'rejected'){
          this.selectedStatusCount = this.applicationsStatusCount[8].total;
        }

        this.checkStatus(this.status);
    });

  }

  checkStatus(status: string) {
    switch (status) {
      case 'applied':
        this.applicationsStatusCount[0].isClicked = true;
        this.selectedStatusCount = this.applicationsStatusCount[0].total;
        this.selectedStatus = 'Applied';
        break;
      case 'shortlist':
        this.applicationsStatusCount[1].isClicked = true;
        this.selectedStatusCount = this.applicationsStatusCount[1].total;
        this.selectedStatus = 'Shortlist';
        break;
      case 'test':
        this.applicationsStatusCount[2].isClicked = true;
        this.selectedStatusCount = this.applicationsStatusCount[2].total;
        this.selectedStatus = 'Test';
        break;
      case 'inter1':
        this.applicationsStatusCount[3].isClicked = true;
        this.selectedStatusCount = this.applicationsStatusCount[3].total;
        this.selectedStatus = 'Interview I';
        break;
      case 'inter2':
        this.applicationsStatusCount[4].isClicked = true;
        this.selectedStatusCount = this.applicationsStatusCount[4].total;
        this.selectedStatus = 'Interview II';
        break;
      case 'hired':
        this.applicationsStatusCount[5].isClicked = true;
        this.selectedStatusCount = this.applicationsStatusCount[5].total;
        this.selectedStatus = 'On Board';
        break;
      case 'withdrawn':
        this.applicationsStatusCount[6].isClicked = true;
        this.selectedStatusCount = this.applicationsStatusCount[6].total;
        this.selectedStatus = 'Withdrawn';
        break;
      case 'eliminated':
        this.applicationsStatusCount[7].isClicked = true;
        this.selectedStatusCount = this.applicationsStatusCount[7].total;
        this.selectedStatus = 'Eliminated';
        break;
      case 'rejected':
        this.applicationsStatusCount[8].isClicked = true;
        this.selectedStatusCount = this.applicationsStatusCount[8].total;
        this.selectedStatus = 'Rejected';
        break;
    }
  }

  chooseStatus(index: number) {
    this.applicationsStatusCount[index].isClicked = true;
    this.selectedStatusCount = this.applicationsStatusCount[index].total;
    switch (index) {
      case 0:
        this.status = 'applied';
        this.selectedStatus = 'Applied';
        break;
      case 1:
        this.status = 'shortlist';
        this.selectedStatus = 'Shortlisted';
        break
      case 2:
        this.status = 'test';
        this.selectedStatus = 'Test';
        break;
      case 3:
        this.status = 'inter1';
        this.selectedStatus = 'Interview I';
        break;
      case 4:
        this.status = 'inter2';
        this.selectedStatus = 'Interview II';
        break;
      case 5:
        this.status = 'hired';
        this.selectedStatus = 'On Board';
        break;
      case 6: 
        this.status = 'withdrawn';
        this.selectedStatus = 'Withdrawn';
        break
      case 7:
        this.status = 'eliminated';
        this.selectedStatus = 'Eliminated';
        break;
      case 8:
        this.status = 'rejected';
        this.selectedStatus = 'Rejected';
        break;
    }

    this.location.replaceState('admin/jobs-ads/' + this.id + '/' + this.status);

    if(this.status === 'inter1'){
      this.status2 = 'INTERVIEW_1';
    }
    else if(this.status === 'inter2'){
      this.status2 = 'INTERVIEW_2';
    }else{
      this.status2 = this.status;
    }

    // if (this.status !== 'applied') {
    //   this.getRecruiters();
    // }else{
    //   this.recruiters = [];
    // }
   // this.onGetJobById(this.id, '1', this.select, this.status, recruiters);

    // this.getInvitationDropdown();

    this.applicationsStatusCount.forEach(
      status => {
        if (this.applicationsStatusCount.indexOf(status) !== index) {
          status.isClicked = false;
        }
      });

      this.applicationService.cleanFilterEmitter().emit();
      // this.minSalary = null;
      // this.maxSalary = null;
      // this.experience = '';
      // this.language = '';
      // this.education = '';
      // this.userStatus = '';
      // this.page = 1;
      // let param = {
      //   jobTitle: '',
      //   jobId: this.id,
      //   userName: '',
      //   minSalary: this.minSalary,
      //   maxSalary: this.maxSalary,
      //   experience: this.experience,
      //   language: this.language,
      //   education: this.education,
      //   userStatus: this.userStatus,
      //   applicationStatus: this.status2,
      //   page: this.page,
      //   entries: this.entries,
      //   collaborators: this.collaborators
      // }

      this.applicantList.applicationStatus = this.status2;
      this.applicantList.triggerFetch();
      // this.onGetJobById(param);
      // this.applicationService.onInitFilterEmitter().emit();
    // // console.log(this.applicationsStatusCount);
  }

 
}

