import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ApplicationService } from 'src/app/core/services/application.service';

@Component({
  selector: 'app-filter-job',
  templateUrl: './filter-job.component.html',
  styleUrls: ['./filter-job.component.scss']
})
export class FilterJobComponent implements OnInit {
  languageCheckFilter: boolean[] = [];
  educationCheckFilter: boolean[] = [];
  experienceCheckFilter: boolean[] = [];
  minimal: number;
  maximal: number;
  potential: boolean;
  @Output() filterValue = new EventEmitter();

  @Input('allNumber')public allNumber;
  @Input('englishNumber')public englishNumber;
  @Input('indonesiaNumber')public indonesiaNumber;
  @Input('smkNumber')public smkNumber;
  @Input('d2Number')public d2Number;
  @Input('d3Number')public d3Number;
  @Input('bachelorNumber')public bachelorNumber;
  @Input('masterNumber')public masterNumber;
  @Input('undergraduateNumber')public undergraduateNumber;
  @Input('freshgraduateNumber')public freshgraduateNumber;
  @Input('onethreeyearsNumber')public onethreeyearsNumber;
  @Input('morethanthreeNumber')public morethanthreeNumber;

  constructor(private applicationService: ApplicationService) { }

  ngOnInit() {
    this.languageCheckFilter = [false, false, false];
    this.educationCheckFilter = [false, false, false, false, false, false];
    this.experienceCheckFilter = [false, false, false, false, false];
    this.potential = false;
    this.applicationService.cleanFilterEmitter().subscribe(data => {
      this.resetFilter();
    })
  }

  languageFilterCheckFunc(i){
    this.languageCheckFilter[i] = !this.languageCheckFilter[i];
    if(i === 0){
      for(var j = 1; j<this.languageCheckFilter.length; j++){
        this.languageCheckFilter[j] = false;
      }
    } else{
      this.languageCheckFilter[0] = false;
    }
  }

  educationFilterCheckFunc(i){
    this.educationCheckFilter[i] = !this.educationCheckFilter[i];
    if(i === 0){
      for(var j = 1; j<this.educationCheckFilter.length; j++){
        this.educationCheckFilter[j] = false;
      }
    } else{
      this.educationCheckFilter[0] = false;
    }
  }

  experienceFilterCheckFunc(i){
    this.experienceCheckFilter[i] = !this.experienceCheckFilter[i];
    if(i === 0){
      for(var j = 1; j<this.experienceCheckFilter.length; j++){
        this.experienceCheckFilter[j] = false;
      }
    } else{
      this.experienceCheckFilter[0] = false;
    }
  }

  potentialFilter(){
    this.potential = !this.potential;
  }

  filterClick(){
    let potential = '';
    if(this.potential){
      potential = 'POTENTIAL';
    }
  
    if(this.maximal < this.minimal){
      alert("The maximum value of salary cannot be less than minimal value");
    }else{
      this.filterValue.emit({
        language:this.languageCheckFilter, 
        education: this.educationCheckFilter, 
        experience: this.experienceCheckFilter, 
        minSalary: this.minimal,
        maxSalary: this.maximal,
        potential: potential});
      }
    }
  resetFilter(){
    this.languageCheckFilter = [false, false, false];
    this.educationCheckFilter = [false, false, false, false, false, false];
    this.experienceCheckFilter = [false, false, false, false, false];
    this.potential = false;
    this.maximal;
    this.minimal;
    // console.log('halo');
    // console.log(this.educationCheckFilter);
  }
  }
  
