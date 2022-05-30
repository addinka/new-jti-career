import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Doc } from 'src/app/core/models/new-recruiter.model';
import { ApplicationService } from 'src/app/core/services/application.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { RecruiterService } from 'src/app/core/services/recruiter.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserService } from 'src/app/core/services/user.service';
import { Arrays, BASE_URL, DOCUMENT_TYPE } from 'src/app/core/utils/constant';

@Component({
  selector: 'app-applicant-list',
  templateUrl: './applicant-list.component.html',
  styleUrls: ['./applicant-list.component.scss']
})
export class ApplicantListComponent implements OnInit {

  public recruiters: Doc[] = [];
  public isAllRecruiter: boolean;
  public processedBy: string;

  public currentId = localStorage.getItem('id');
  public currentName = localStorage.getItem('name') + ' (Me)';

  public isFetched: boolean = false;
  public isNoData: boolean = false;
  public entItems = [];
  public invItems = [];
  public stsItems = Arrays.STATUS;

  public cameFromSort: boolean = false;
  public cameFromSearch: boolean = false;

  public arrowDown = "../../assets/images/ic_triangle.svg"
  public getRecruiterImageURL = BASE_URL

  public allNumber: number = 0;
  public englishNumber: number = 0;
  public indonesiaNumber: number = 0;
  public smkNumber: number = 0;
  public d2Number: number = 0;
  public d3Number: number = 0;
  public bachelorNumber: number = 0;
  public masterNumber: number = 0;
  public undergraduateNumber: number = 0;
  public freshgraduateNumber: number = 0;
  public onethreeyearsNumber: number = 0;
  public morethanthreeNumber: number = 0;
  public potentialNumber: number = 0;

  // Filtering Parameters
  // public searchUsername: string = '';
  // public searchJob: string = '';
  public searchUsername: string = '';  // For search by username
  public searchJob: string = '';        // For search by jobname
  public language: string = '';
  public education: string = '';
  public experience: string = '';
  public minSalary: null;
  public maxSalary: null;
  public collaborators: string = '';
  public applicationStatus: string = ''; // for filtering with application getstatus
  get status() {return this.applicationStatus;}
  // public userStatus: string = '';

  // these input below for filtering params that defined outside this component 
  // you can basicly change any params into Input-able, but currently
  // only these params being used for passing parameters from parent component
  @Input() jobId: string = '';            // For filtering withJobId
  @Input() userStatus: string = '';       // for userstatus Open, potential, etc
  get params() {
    return ({
      jobId: this.jobId,
      jobTitle: this.searchJob,
      userName: this.searchUsername,
      minSalary: this.minSalary,
      maxSalary: this.maxSalary,
      experience: this.experience,
      language: this.language,
      education: this.education,
      userStatus: this.userStatus,
      applicationStatus: this.applicationStatus,
      page: this.page,
      entries: this.entries,
      collaborators: this.collaborators
    });
  }

  public entries: number = 10;
  public page: number = 1;
  public currentLowerCount: number;
  public currentUpperCount: number;
  public currentSortType: string;
  public currentSortBy: string;
  public pagesCount: number;
  public sortUserName: boolean = true;
  public sortExpSalary: boolean = true;
  public sortInviteTime: boolean = true;
  public sortDegree: boolean = true;
  public sortExperience: boolean = true;

  public data: any = [];
  public dataCount: number;

  public docs: Object[] = [];
  public documentType = DOCUMENT_TYPE;

  public applicantsViewin = {
    grid: false,
    list: true
  };

  public applicantDetailShown: boolean[] = [];
  public indexApplicantDetailContainerShown: number;
  public indexApplicantDetailShown: number;
  public isApplicantDetailShown: Boolean = false;

  // You can add flag below for conditioning component by 
  // spesific usage in a certain page
  @Input() inJobDetail: boolean = false;  // flag for being used in jobdetail page

  @Output() callback = new EventEmitter;  // callback function called for every initiateFilter

  constructor(
    private recruiterService: RecruiterService,
    private applicationService: ApplicationService,
    private dialogService: DialogService,
    private userService: UserService,
    private toastService: ToastService

  ) { 
    this.entItems = Arrays.ENTRY;
    // if (this.inJobDetail) this.entItems = ['5', ...Arrays.ENTRY]
    this.entries = this.entItems[0];
  }

  ngOnInit() {
    this.getRecruiters();
    this.triggerFetch();
  }

  getRecruiters() {
    this.collaborators = "";
    this.recruiterService.getRecruiters()
      .subscribe(res => {
        // console.log(res);
        this.recruiters = res.docs;
        this.recruiters.forEach(element => {
          element.selected = false;
          this.isAllRecruiter = false;
          this.processedBy = '';
        });
        // console.log(this.collaborators);
      });
      
  }

  public triggerFetch() {
    console.log("masukni")
    console.log(this.applicationStatus, "child")
    this.initiateFilter(this.params);
  }

  initiateFilter(param: any){
      
    this.invItems = [];
    this.applicationService.getApplicantFilter(param)
      .subscribe(res => {
        // console.log(res);
        if(!this.cameFromSort){
          this.sortUserName = true;
          this.sortDegree = true;
          this.sortExpSalary = true;
          this.sortExperience = true;
          this.sortInviteTime = true;
          this.currentSortType = '';
          this.currentSortBy = '';
        }
        //this.dataCount = res.count;
        this.pagesCount = Math.ceil(res.resultSummary.filterResult.filterTotal / Number(this.entries));
        this.dataCount = res.resultSummary.filterResult.filterTotal;
        this.currentLowerCount =  1 + ((this.page-1) * this.entries);
        this.currentUpperCount = this.page * this.entries;
        if(this.currentUpperCount > this.dataCount){
          this.currentUpperCount = this.dataCount;
        }
        this.data = res.filteredResult;
        
        // if(this.cameFromSearch){
          this.allNumber = res.resultSummary.filterResult.filterTotal;
          this.englishNumber = res.resultSummary.language.english;
          this.indonesiaNumber = res.resultSummary.language.indonesian;
          this.smkNumber = res.resultSummary.education.smk;
          this.d2Number = res.resultSummary.education.d2;
          this.d3Number = res.resultSummary.education.d3;
          this.bachelorNumber = res.resultSummary.education.bachelor;
          this.masterNumber = res.resultSummary.education.master;
          this.undergraduateNumber = res.resultSummary.experience.underGraduate;
          this.freshgraduateNumber = res.resultSummary.experience.freshGraduate;
          this.onethreeyearsNumber = res.resultSummary.experience.onetothreeyear;
          this.morethanthreeNumber = res.resultSummary.experience.morethreeyear;
          this.potentialNumber = 0;
          this.cameFromSearch = false;
        // }
        
        this.data.forEach((element, i) => {
          for (let index = 0; index < this.getObjectLength(element.user.attachments); index++) {
            const keys = Object.keys(this.data[i].user.attachments);
            // // console.log(keys);

            this.docs.push({
              type: keys[index],
              name: this.documentType[keys[index]],
              file: '/user/att/' + keys[index],
              tempFile: null,
              mark: {
                delete: false,
                reupload: false,
                newUpload: false
              }
            });

          }

           this.userService.getProfilePic(this.data[i].userID+ '?cacheBreak=' + new Date().getTime()).subscribe(
            response => {
              this.picChangeUser(this.blobToFile(response, 'profPic'), i);
            },error =>{
                // console.log(error);
            });
          
          this.getInvitationDropdown(i);
          this.applicantDetailShown.push(false);
          this.data[i].user.attachments = this.docs;
          this.docs = [];
          
        });

        // console.log(this.data);
        this.cameFromSort = false;
        this.isNoData =  this.data.length === 0;
        this.isFetched = true;
      }
    );

    this.callback.emit();

    // if(this.searchMode){
    //   this.showText = this.searchJob;
    // }else{  
    //   this.showText = this.searchUsername;
    // }
    
  }


  onSelectRecruiter(index: number) {
    const el = this.recruiters[index];
    el.selected = !el.selected;
    let checkSelect = false;
    let beginning = true;
    this.collaborators = '';
    for (let i = 0; i < this.recruiters.length; i++) {
      const element = this.recruiters[i];
      if (!element.selected) {
        break;
      } else if (i === this.recruiters.length - 1) {
        this.isAllRecruiter = !this.isAllRecruiter;
        this.processedBy = 'All';
        checkSelect = true;
      }
    }

    let recruiters = '';
    this.recruiters.forEach(element => {
      if (element.selected) {
        recruiters += ',' + element._id;
      }
    });

    if(!checkSelect){
      this.processedBy = '';
      this.recruiters.forEach(element => {
        if (element.selected) {
          // console.log(element.name);
          if(beginning){
            if (this.currentId === element._id){
              this.processedBy +=  element.name + ' (Me)';
              beginning = false;
            }else{
              this.processedBy +=  element.name;
              beginning = false;
            }
            this.collaborators += '' + element._id;
          }else{
            // console.log(element.name);
            if (this.currentId === element._id){
              this.processedBy +=  ', ' + element.name + ' (Me)';
            }else{
              this.processedBy +=  ', ' +  element.name;
            }
            this.collaborators += ',' + element._id;
          }
        }
      });
    }
      this.page = 1;
      //do the filter here
      this.initiateFilter(this.params);
      this.applicationService.onInitFilterEmitter().emit();
  }

  onSelectAllRecruiter() {
    this.processedBy = '';
    this.collaborators = '';
    if(this.isAllRecruiter){
      this.isAllRecruiter = false;
      this.recruiters.forEach(element => {
        element.selected = false;
      });
      
    }else{
      this.processedBy = 'All';
      this.isAllRecruiter = true;
      this.recruiters.forEach(element => {
        element.selected = true;
      });
    }
     //do the filter here
    this.page = 1;
      this.initiateFilter(this.params);
      this.applicationService.onInitFilterEmitter().emit();
  }

  getInvitationDropdown(index) {
    // Set status dropdown invite
    this.stsItems = [];
    // console.log(index);
    // console.log(this.data[index].status);
    // console.log(this.invItems);

    if(this.data[index].status === 'APPLIED'){
      this.stsItems = ["Shortlist", "Test", "Interview I", "Interview II", "On Board", "Withdraw"];
    }
    if(this.data[index].status === 'SHORTLIST'){
      this.stsItems = ["Test", "Interview I", "Interview II", "On Board", "Withdraw"];
    }
    if(this.data[index].status === 'TEST'){
      this.stsItems = ["Interview I", "Interview II", "On Board", "Withdraw"];
    }
    if(this.data[index].status === 'INTERVIEW_1'){
      this.stsItems = ["Interview II", "On Board", "Withdraw"];
    }
    if(this.data[index].status === 'INTERVIEW_2'){
      this.stsItems = ["On Board", "Withdraw"];
    }
    // console.log(this.stsItems);
    this.invItems.push(this.stsItems);
    // switch (this.data[index].status) {
    //   case this.invItems[1]:
        
    //     break;
    //   case this.stsItems[2]:
    //     this.invItems[index].shift();
    //     this.invItems[index].shift();
    //     break;
    //   case this.stsItems[3]:
    //     this.invItems[index].shift();
    //     this.invItems[index].shift();
    //     this.invItems[index].shift();
    //     break;
    //   default:
    //     break;
    // }
 }

 getFilterInput(filterInput){
  // console.log('here');
  // console.log(filterInput);
  // if(this.isSearching === true){
  this.education = "";
  this.language = "";
  this.experience = "";
  this.userStatus= "";
  let beginningEducation = true;
  let beginningLanguage = true;
  let beginningExperience = true;

  //education FILTER
  if(filterInput.education[0] === true){
      this.education += "SMK,D2,D3,Bachelor,Master";
  }
  if(filterInput.education[1] === true){
    if(beginningEducation){
      this.education += 'SMK';
      beginningEducation = false;
    }
    else{
      this.education += ',SMK';
    }
  }

  if(filterInput.education[2] === true){
    if(beginningEducation){
      this.education += 'D2';
      beginningEducation = false;
    }
    else{
      this.education += ',D2';
    }
  }

  if(filterInput.education[3] === true){
    if(beginningEducation){
      this.education += 'D3';
      beginningEducation = false;
    }
    else{
      this.education += ',D3';
    }
  }

  if(filterInput.education[4] === true){
    if(beginningEducation){
      this.education += 'Bachelor';
      beginningEducation = false;
    }
    else{
      this.education += ',Bachelor';
    }
  }

  if(filterInput.education[5] === true){
    if(beginningEducation){
      this.education += 'Master';
      beginningEducation = false;
    }
    else{
      this.education += ',Master';
    }
  }

  // console.log('education = ', this.education);

  //Language FILTER
  if(filterInput.language[0] === true){
      this.language += 'English,Indonesia';
  }
  if(filterInput.language[1] === true){
    if(beginningLanguage){
      this.language += 'English';
      beginningLanguage = false;
    }
  }
  if(filterInput.language[2] === true){
    if(beginningLanguage){
      this.language += 'Indonesia';
      beginningLanguage = false;
    }
    else{
      this.language += ',Indonesia';
    }
  }

  // console.log("language = ", this.language)

  //Experience FILTER
  if(filterInput.experience[0] === true){
    this.experience += 'under graduate,fresh graduate,1-3 years,> 3 years';
  }
  if(filterInput.experience[1] === true){
    if(beginningExperience){
      this.experience += 'under graduate';
      beginningExperience = false;
    }else{
      this.experience += ',under graduate';
    }
  }
  if(filterInput.experience[2] === true){
    if(beginningExperience){
      this.experience += 'fresh graduate';
      beginningExperience = false;
    }else{
      this.experience += ',fresh graduate';
    }
  }
  if(filterInput.experience[3] === true){
    if(beginningExperience){
      this.experience += '1-3 years';
      beginningExperience = false;
    }else{
      this.experience += ',1-3 years';
    }
  }
  if(filterInput.experience[4] === true){
    if(beginningExperience){
      this.experience += '> 3 years';
      beginningExperience = false;
    }else{
      this.experience += ', > 3 years';
    }
  }

  // console.log('experience = ', this.experience);

  //Salary list
  if(filterInput.maxSalary !== undefined && filterInput.maxSalary !== null){
    this.maxSalary = filterInput.maxSalary
  }
  else{
    this.maxSalary = null;
  }

  if(filterInput.minSalary !== undefined && filterInput.minSalary !== null){
    this.minSalary = filterInput.minSalary
  }else{
    this.minSalary = null;
  }
  
  // console.log(this.maxSalary + "+" + this.minSalary);

  //Potential tag
  if(filterInput.potential !== ''){
    this.userStatus = filterInput.potential;
  }
  // console.log('potential=', this.userStatus);
  this.page = 1;

  this.initiateFilter(this.params);
  this.applicationService.onInitFilterEmitter().emit();
  
}

  onChangePage(pageNumber){
    this.page = pageNumber;
    this.cameFromSort = true;

    let param = {
      ...this.params,
      sortBy: this.currentSortBy,
      sortType: this.currentSortType
    }

    this.initiateFilter(param);
  }

  openRejectDialog(data: any) {
    const id = data._id;
    let nextStatus = "rejected";
    switch (data.status) {
      case 'TEST':
      case 'INTERVIEW_1':
      case 'INTERVIEW_2':
        nextStatus = "eliminated";
        break;
      default: 
        nextStatus = 'rejected';
        break;
    };
    const dialogRef = this.dialogService.getRejectDialog(id, nextStatus);

    dialogRef.afterClosed().subscribe(result => {
      if (result.isEliminate) {
        this.page = 1;
    
        this.initiateFilter(this.params);
        this.applicationService.onInitFilterEmitter().emit();
      }
    });
  }

  onInvite(type: String, applicant: any) {
    let param = {
      ...this.params,
      page: 1
    }

    if(type === 'Shortlist'){
      let data = new FormData();
      data.append("appliID", applicant.applicationID);

      // console.log(data);
      this.applicationService.inviteCandidate(type.toLowerCase(), data)
        .subscribe(
          response => {
            this.toastService.success('Candidates has been shortlisted.');
            this.initiateFilter(param);
            this.applicationService.onInitFilterEmitter().emit();
          },
          error => {
            this.toastService.error(error.error.message);
          });
    } else {

      let dialogRef;
      if (type==="Withdraw") {
        dialogRef = this.dialogService.getRejectDialog(applicant._id, "withdrawn")
      } else  {
        dialogRef = this.dialogService.getInviteCandidateDialog(type, applicant);
      }

      dialogRef.afterClosed().subscribe(result => {
        if (result.next) {
          this.initiateFilter(param);
          this.applicationService.onInitFilterEmitter().emit();
        }
      });
    }
    
  }

  sortTable(column){
    this.cameFromSort = true;
    //userName / expSalary / inviteTime / degree / experience
    let sortType = '';
    let sortBy = column;
    this.page = 1;
    if(column === 'userName'){
      if(this.sortUserName === false){
        sortType = 'desc';
      }else{
        sortType = 'asc';
      }
      this.sortUserName = !this.sortUserName;
    }else if(column === 'expSalary'){
      if(this.sortExpSalary === false){
        sortType = 'desc';
      }else{
        sortType = 'asc';
      }
      this.sortExpSalary = !this.sortExpSalary;
    }else if(column === 'inviteTime'){
      if(this.sortInviteTime === false){
        sortType = 'desc';
      }else{
        sortType = 'asc';
      }
      this.sortInviteTime = !this.sortInviteTime;
    }else if(column === 'degree'){
      if(this.sortDegree === false){
        sortType = 'desc';
      }else{
        sortType = 'asc';
      }
      this.sortDegree = !this.sortDegree;
    }else if(column === 'experience'){
      if(this.sortExperience === false){
        sortType = 'desc';
      }else{
        sortType = 'asc';
      }
      this.sortExperience = !this.sortExperience;
    }
    let param = {
      ...this.params,
      page: 1,
      sortType: sortType,
      sortBy: sortBy
    }

    this.currentSortBy = sortBy;
    this.currentSortType = sortType;
    // console.log(param);
    this.initiateFilter(param);
    this.applicationService.onInitFilterEmitter().emit();
  }

  onSelectPotential(applicant) {
    // console.log(applicant);
    if (applicant.userStatus === 'POTENTIAL') {
      applicant.userStatus = 'OPEN';
      for(var i = 0; i<this.data.length; i++){
        if(applicant.user._id === this.data[i].user._id){
          this.data[i].userStatus = 'OPEN';
        }
      }
    } else {
      applicant.userStatus = 'POTENTIAL';
      for(var i = 0; i<this.data.length; i++){
        if(applicant.user._id === this.data[i].user._id){
          this.data[i].userStatus = 'POTENTIAL';
        }
      }
    }

    
    this.userService.toggleUserPotential(applicant.user.email).subscribe(res => {
      this.toastService.success('Candidate Potential Updated');
    });
  }

  onChangeEntryNumber(number){
    this.entries = number;
    this.page = 1;
    let param = {
      jobId: this.jobId,
      jobTitle: this.searchJob,
      userName: this.searchUsername,
      minSalary: this.minSalary,
      maxSalary: this.maxSalary,
      experience: this.experience,
      language: this.language,
      education: this.education,
      userStatus: this.userStatus,
      applicationStatus: this.applicationStatus,
      page: 1,
      entries: this.entries,
      collaborators: this.collaborators
    }

    this.initiateFilter(this.params);
    this.applicationService.onInitFilterEmitter().emit();
  }

  getGridIcon() {
    if (this.applicantsViewin.grid) {
      return 'assets/images/ic_grid_blue.svg';
    } else {
      return 'assets/images/ic_grid_grey.svg';
    }
  }

  getListIcon() {
    if (this.applicantsViewin.list) {
      return 'assets/images/ic_list_blue.svg';
    } else {
      return 'assets/images/ic_list_grey.svg';
    }
  }

  showApplicantAction(applicant: any): Boolean {
    // These status will not show any action button dropdown
    return !(["REJECTED", "HIRED", "WITHDRAWN", "ELIMINATED"].includes(applicant.status));
  }

  exportTable(){
    let param = {
      jobId: this.jobId,
      jobTitle: this.searchJob,
      userName: this.searchUsername,
      minSalary: this.minSalary,
      maxSalary: this.maxSalary,
      experience: this.experience,
      language: this.language,
      education: this.education,
      userStatus: this.userStatus,
      applicationStatus: this.applicationStatus,
      recruiterID: this.collaborators
    }
    // console.log(param);
    this.userService.generateDocument(param)
      .subscribe(res => {
        this.toastService.success('Export excel document has been sent to your email');
      },
      error => {
        this.toastService.error('Something wrong happened with the export. Please seek the support operator');
      });
  }

  onSelectView(type: any) {
    if (type === 'grid') {
      this.applicantsViewin.grid = true;
      this.applicantsViewin.list = false;
    } else {
      this.applicantsViewin.grid = false;
      this.applicantsViewin.list = true;
    }
  }

  getObjectLength(object: any): number {
    let length = 0;
    for ( const key in object ) {
        if ( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;
  
    // Cast to a File() type
    return theBlob as File;
  }
  
  picChangeUser(thePicture: File, i) {
    // for picture changes
    const reader = new FileReader();
    reader.onload = e => {
      this.data[i].user.profpic = reader.result;
    };
  
    reader.readAsDataURL(thePicture);
  }

}
