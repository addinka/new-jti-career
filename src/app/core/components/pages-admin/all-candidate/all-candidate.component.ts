import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Doc } from 'src/app/core/models/new-recruiter.model';
import { ApplicationService } from 'src/app/core/services/application.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { RecruiterService } from 'src/app/core/services/recruiter.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserService } from 'src/app/core/services/user.service';
import { Arrays, BASE_URL, CV_COLOR, DOCUMENT_TYPE } from 'src/app/core/utils/constant';
import { FormBuilder, FormControl } from '@angular/forms';
import { AllCandidateFilter } from 'src/app/core/models/filter-all-candidate.model';

@Component({
  selector: 'app-all-candidate',
  templateUrl: './all-candidate.component.html',
  styleUrls: ['./all-candidate.component.scss']
})
export class AllCandidateComponent implements OnInit {

  // @Input() flag;
  public search: string;
  public searchTypes: string[] = Arrays.CANDIDATE_SEARCH_TYPES;
  public searchModeIndex: number = 0
  public get searchMode(): string {return this.searchTypes[this.searchModeIndex]};

  public showText: string;
  public isSearching: boolean = false;

  public getImageURL: any;
  public getRecruiterImageURL:any = BASE_URL;

  public entItems = [];

  public data: any = [];
  public dataCount: number;
  public entriesInput: FormControl;
  get entries(): number { return this.entriesInput.value };
  public page: number = 1;
  public currentLowerCount: number;
  public currentUpperCount: number;

  public pagesCount: number;

  public arrowDown = "../../assets/images/ic_triangle.svg"

  public docs: Object[] = [];
  public documentType = DOCUMENT_TYPE;

  public applicantDetailShown: boolean[] = [];
  public indexApplicantDetailContainerShown: number;
  public indexApplicantDetailShown: number;
  public isApplicantDetailShown: Boolean = false;

  // // 
  public filterCounter: AllCandidateFilter;
  public sortBy: string;
  public sortTypeAsc: boolean = true;
  public currentSort: string;
  public filterParam: any = {
    status: 'OPEN'
  };

  get sortType() :string {
    return this.sortTypeAsc ? 'asc' : 'desc';
  }

  get isNoData(): boolean {
    return !this.isSearching || !(this.data.length > 0)
  }

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private recruiterService: RecruiterService,
    private applicationService: ApplicationService,
    private dialogService: DialogService,
    private userService: UserService,
    private toastService: ToastService,
    private fb: FormBuilder
    ) { 
      this.entItems = Arrays.ENTRY;
      this.entriesInput = this.fb.control(this.entItems[0]);
      this.entriesInput.valueChanges.pipe().subscribe(()=>{
        this.page = 1;
        this.getCandidates();
      })
      
    }

  ngOnInit() {
    this.getCandidates();
  }

  getCandidates() {
    const params = {
      entries: this.entries,
      page: this.page,
      ...this.filterParam
    };
    if (this.sortBy) {
      params['sort'] = this.sortBy;
      params['direction'] = this.sortType;
    }
    if (this.search) {
      params[this.searchMode] = this.search;
    }
    this.userService.searchAllUser(params).subscribe(res=>{
      this.data = res.docs.map(x=>{
        const attachments = Object.keys(x.attachments).map(attKey=>({
          type: attKey,
          name: this.documentType[attKey],
          file: x.attachments[attKey],
          tempFile: null,
          mark: {
            delete: false,
            reupload: false,
            newUpload: false
          }
        }));

        return ({...x, user: {...x, attachments}})
      });
      this.dataCount = res.count;
      this.filterCounter = res.counter;
      this.pagesCount = Math.ceil(this.dataCount / Number(this.entries));
      this.currentLowerCount =  1 + ((this.page-1) * this.entries);
      this.currentUpperCount = this.page * this.entries;
      if(this.currentUpperCount > this.dataCount){ this.currentUpperCount = this.dataCount; }
      this.isSearching = true;
      this.showText = this.search;
      // if (!this.sortBy) { this.currentSort=undefined;}
      // this.sortBy = undefined;
      
    });
  }

  changeSearchMode(index){
    this.searchModeIndex = index;
  }

  onSearch() {
    this.page = 1;
    this.getCandidates();
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

  getFilterInput(filterInput){
    // console.log(filterInput)
    this.filterParam = filterInput;
    this.page = 1;
    this.getCandidates();
  }

  onChangePage(pageNumber){
    this.page = pageNumber;
    this.getCandidates();
  }


  sortTable(column){
    if (this.currentSort !== column) {
      this.sortTypeAsc = true;
      // console.log("ganti")
    } else {
      this.sortTypeAsc = !this.sortTypeAsc;
      // console.log("toggle")
    }
    this.sortBy = column;
    this.currentSort = column;
    this.page = 1;
    this.getCandidates();
  }

  onSelectPotential(candidate) {
    if (candidate.status === 'POTENTIAL') {
      candidate.status = 'OPEN';
      for(var i = 0; i<this.data.length; i++){
        if(candidate._id === this.data[i]._id){
          this.data[i].status = 'OPEN';
        }
      }
    } else {
      candidate.status = 'POTENTIAL';
      for(var i = 0; i<this.data.length; i++){
        if(candidate._id === this.data[i]._id){
          this.data[i].status = 'POTENTIAL';
        }
      }
    }

    this.userService.toggleUserPotential(candidate.email).subscribe(_res => {
      this.toastService.success('Candidate Potential Updated');
    });
  }

  exportTable(){
  }

  onInvite(candidate: any) {
    const dialogRef = this.dialogService.getSendBlueFormDialog(candidate.user);

    dialogRef.afterClosed().subscribe(result => {
      if (result.next) {
        this.getCandidates();
      }
    });
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
