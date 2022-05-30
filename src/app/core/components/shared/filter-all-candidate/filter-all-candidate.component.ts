import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AllCandidateFilter, AllCandidateFilterGroup, InitialCandidateFilter } from 'src/app/core/models/filter-all-candidate.model';
import { ApplicationService } from 'src/app/core/services/application.service';

@Component({
  selector: 'app-filter-all-candidate',
  templateUrl: './filter-all-candidate.component.html',
  styleUrls: ['../filter-candidate/filter-candidate.component.scss']
})
export class FilterAllCandidateComponent implements OnInit {

  filter: AllCandidateFilterGroup;

  @Output() filterValue = new EventEmitter();

  @Input('counter') public counter: AllCandidateFilter;

  constructor(private applicationService: ApplicationService) { 
    this.resetFilter();
  }

  ngOnInit() {
    this.applicationService.cleanFilterEmitter().subscribe(data => {
      this.resetFilter();
    })
  }

  changeFilter(group: string, value?: string) {
    if (value) {
      const arrayGroup: string[] = this.filter[group];
      let newArrayGroup: string[];
      // this for multivalue
      if (arrayGroup.includes(value)) {
        // newArrayGroup = arrayGroup.filter(f=>f!==value);
        newArrayGroup = [];
      } else {
        // newArrayGroup = arrayGroup;
        // newArrayGroup.push(value);
        newArrayGroup = [value]
      }

      
      this.filter[group] = newArrayGroup;
    } else {
      this.filter[group] = [];
    }
    // console.log(this.filter)
  }
  
  checked(group:string, value?:string): boolean {
    if (value) return this.filter[group].includes(value);
    return this.filter[group].length === 0;
  }

  filterClick(){
    const filterParam = {};
    Object.keys(this.filter).forEach(key=>{
      if(this.filter[key].length>0) {
        filterParam[key] = this.filter[key].reduce((pv,cv)=>pv+','+cv)
      }
    });

    this.filterValue.emit(filterParam);
    }

  resetClick() {
    this.resetFilter();
    this.filterClick();
  }

  resetFilter(){
    this.filter = {
      language: [],
      education: [],
      experience: [],
      applied: [],
      cv: [],
      status: ['OPEN'],
    }
  }
}
