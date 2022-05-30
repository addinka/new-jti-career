import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Doc } from 'src/app/core/models/new-recruiter.model';
import { ApplicationService } from 'src/app/core/services/application.service';
import { ApplicantListComponent } from '../jobs-ads-detail/components/applicant-list/applicant-list.component';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit {
  @Input() flag;
  public search: string;
  public searchMode: boolean = false;
  public searchPlaceholder: string = 'By Name';
  public searchDropdown: string = 'By Title';

  public showText: string;
  public isSearching: boolean = false;

  public currentId: string;
  public recruiters: Doc[] = [];
  public isAllRecruiter: boolean;
  public processedBy: string;
  public currentName: string;

  public getImageURL: any;
  public getRecruiterImageURL:any;

  public isNoData: boolean = false;
  public entItems = [];
  public invItems = [];

  public userStatus: string = '';


  @ViewChild(ApplicantListComponent) applicantList: ApplicantListComponent;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe( params =>
      this.flag = params.get('flag')
    );

    this.currentId = localStorage.getItem('id');
    this.currentName = localStorage.getItem('name') + ' (Me)';

    if (this.flag === 'true') {
      this.userStatus = "POTENTIAL"
    }
  }

  changeSearchMode(){
    this.searchMode = !this.searchMode;
    //if false, search by name. Else, title
    if(!this.searchMode){
      this.searchPlaceholder = 'By Name';
      this.searchDropdown = 'By Title';
    }else{
      this.searchPlaceholder = 'By Title'
      this.searchDropdown = 'By Name';
    }
  }

  onSearch() {
    this.isSearching = true;
    // console.log(this.searchMode);
    if(!this.searchMode){
      this.applicantList.searchUsername = this.search;
      this.applicantList.searchJob = '';
      this.showText = this.search;
    }else{
      this.applicantList.searchJob = this.search;
      this.applicantList.searchUsername = '';
      this.showText = this.search;
    }  
    this.applicationService.cleanFilterEmitter().emit();
    this.applicantList.minSalary = null;
    this.applicantList.maxSalary = null;
    this.applicantList.experience = '';
    this.applicantList.language = '';
    this.applicantList.education = '';
    this.applicantList.userStatus = '';

    this.applicantList.triggerFetch();
    // this.applicationService.onInitFilterEmitter().emit();
  }

}
