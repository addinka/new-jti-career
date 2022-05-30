import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Sort } from '@angular/material';

import { Filter } from 'src/app/core/models/filter.model';
import { Job } from 'src/app/core/models/job.model';

import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  public token: string;
  public types: string[] = [
    'location', 'experience', 'employment'
  ];
  public locations: Filter[] = [
    new Filter('All', true),
    new Filter('Jakarta', false),
    new Filter('Bandung', false),
    new Filter('Surabaya', false),
    new Filter('Medan', false),
    new Filter('Other', false)
  ];
  public experiences: Filter[] = [
    new Filter('All', true),
    new Filter('UnderGrad.', false),
    new Filter('FreshGrad.', false),
    new Filter('> 3 Years', false)
  ];
  public educations: Filter[] = [
    new Filter('All', true),
    new Filter('D3', false),
    new Filter('Bachelor', false),
    new Filter('Master', false)
  ];
  public employments: Filter[] = [
    new Filter('All', true),
    new Filter('Intern', false),
    new Filter('Fulltime', false)
  ];
  public selects: string[] = [
    '5', '10', '20', '30', '40', '50'
  ];
  public chips: string[] = [];
  public jobs: Job[] = [];
  public sortedJobs: Job[];
  public entriesCount = 0;
  public jobsCount = 0;
  public page = 1;
  public select = this.selects[0];
  public pagesCount = 0;
  public search: string;
  public searchFromHeader: boolean;
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
  public searchImageText = 'Search Your Desired Job';

  constructor(
    private jobService: JobService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private location: Location) { }

  ngOnInit() {
    // Uncomment this for dummy jobs.
    // this.sortedJobs = this.jobsDummy.slice();

    // Get search query param.
    this._activatedRoute.queryParams.subscribe(
      params => {
        if (params['search'] === undefined) {
          this.search = '';
          this.onGetJob('1', this.selects[0]);
        } else {
          this.search = params['search'];
          this.onGetJobByRole(this.search, '1', this.selects[0]);
        }
      });

    // Get search from header.
    if (this.jobService.searchFromHeader) {
      this.searchFromHeader = true;
    } else {
      this.searchFromHeader = false;
    }
    // console.log(this.jobService.searchFromHeader);
  }

  onGetJob(page: string, entries: string) {
    this.jobService.getOpenJobs(page, entries)
      .subscribe(jobs => {
        const data = jobs.rows;

        // Set jobs count.
        this.jobsCount = jobs.total_rows;

        // Reinitialize jobs and entries count.
        this.jobs = [];
        this.sortedJobs = [];
        this.entriesCount = 0;

        // Push jobs.
        data.forEach(element => {
          const el = element.value;
          this.jobs.push(new Job(
            el._id,
            el.title,
            el.location,
            el.experience,
            el.education,
            el.employment,
            el.onBoardStart,
            element.applied
          ));

          const test = [];

          if (element.applied) {
            if (Object.keys(element.value.appliCount.applied)) {
              // console.log(Object.keys(element.value.appliCount.applied).toString());
              this.jobs[this.entriesCount].id = (Object.keys(element.value.appliCount.applied).toString());
            }
          }

          this.sortedJobs = this.jobs.slice();

          this.entriesCount += 1;

          this.pagesCount = Math.ceil(this.jobsCount / Number(this.select));
        });
      });
  }

  onGetJobByRole(title: string, page: string, entries: string) {
    this.jobService.getJobsByRole(title, page, entries)
      .subscribe(jobs => {
        // Set jobs count.
        this.jobsCount = jobs.count;

        // Show image if not found any data.
        if (this.jobsCount === 0) {
          this.searchFromHeader = true;
          this.searchImageText = 'No job opening';
        } else {
          this.searchFromHeader = false;
        }

        // Reinitialize jobs and entries count.
        this.jobs = [];
        this.sortedJobs = [];
        this.entriesCount = 0;

        // Push jobs.
        jobs.docs.forEach(element => {
          this.jobs.push(new Job(
            element._id,
            element.title,
            element.location,
            element.experience,
            element.education,
            element.employment,
            element.onBoardStart,
            element.applied
          ));
          this.sortedJobs = this.jobs.slice();

          this.entriesCount += 1;

          this.pagesCount = Math.ceil(this.jobsCount / Number(this.select));
        });
      });
  }

  onPagesJob(page: string) {
    if (this.search === '') {
      this.onGetJob(page, this.select);
    } else {
      this.onGetJobByRole(this.search, page, this.select);
    }
  }

  onSearch(search: string) {
    if (search !== '') {
      this.searchFromHeader = false;
      this.onGetJobByRole(search, '1', this.select);
      this.location.replaceState('jobs?search=' + search);
    } else {
      this.onGetJob('1', this.selects[0]);
      this.searchFromHeader = false;
      this.location.replaceState('jobs');
    }
  }

  onSelect(value: any) {
    this.select = value;

    // TODO: Bug page not change when select entries.

    if (this.search === '') {
      this.onGetJob('1', value);
    } else {
      this.onGetJobByRole(this.search, '1', value);
    }
  }

  onPushChip(name: string) {
    if (this.chips.length === 0) {
      this.chips.push(name);
    } else {
      let isDuplicate: boolean;

      // Check if chip already exists or not.
      for (let index = 0; index < this.chips.length; index++) {
        const element = this.chips[index];
        if (element === name) {
          isDuplicate = true;
          break;
        }
      }
      if (!isDuplicate) {
        this.chips.push(name);
      }
    }
  }

  onUnSelect(event: any) {
    if (event.name === 'All') {
      switch (event.type) {
        case this.types[0]:
          for (let index = 0; index < this.locations.length; index++) {
            const j = this.chips.indexOf(this.locations[index].name);
            if (j > -1) {
              this.chips.splice(j, 1);
            }
          }
          break;
        case this.types[1]:
          for (let index = 0; index < this.experiences.length; index++) {
            const j = this.chips.indexOf(this.experiences[index].name);
            if (j > -1) {
              this.chips.splice(j, 1);
            }
          }
          break;
        case this.types[2]:
          for (let index = 0; index < this.educations.length; index++) {
            const j = this.chips.indexOf(this.educations[index].name);
            if (j > -1) {
              this.chips.splice(j, 1);
            }
          }
          break;
        case this.types[3]:
          for (let index = 0; index < this.employments.length; index++) {
            const j = this.chips.indexOf(this.employments[index].name);
            if (j > -1) {
              this.chips.splice(j, 1);
            }
          }
          break;
        default:
          break;
      }
    } else {
      for (let index = 0; index < this.chips.length; index++) {
        const element = this.chips[index];
        if (element === event.name) {
          this.chips.splice(index, 1);
          break;
        }
      }
    }
  }

  onAllSelected(event: any) {
    let array: Filter[];

    switch (event.type) {
      case this.types[0]:
        array = this.locations;
        break;
      case this.types[1]:
        array = this.experiences;
        break;
      case this.types[2]:
        array = this.educations;
        break;
      case this.types[3]:
        array = this.employments;
        break;
      default:
        break;
    }

    if (event.isAll) {
      array.forEach((element, index) => {
        if (index === 0) {
          element.selected = true;
        } else {
          element.selected = false;
        }
      });
    } else {
      array[0].selected = false;
    }

    if (event.name !== 'All') {
      this.onPushChip(event.name);
    }
  }

  onClear() {
    // Reinitialize chips.
    this.chips = [];

    // Reinitialize filters.
    this.onDefaultFilter(this.locations);
    this.onDefaultFilter(this.experiences);
    this.onDefaultFilter(this.educations);
    this.onDefaultFilter(this.employments);
  }

  onDefaultFilter(array: Filter[]) {
    array.forEach((element, index) => {
      if (index === 0) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });
  }

  onDelete(chip: string) {
    // const chip = event.chip;
    const deleteIndex = this.chips.indexOf(chip);

    // Delete chip.
    this.chips.splice(deleteIndex, 1);

    // Binding filters, manually.
    this.onBindingFilter(this.locations, chip);
    this.onBindingFilter(this.experiences, chip);
    this.onBindingFilter(this.educations, chip);
    this.onBindingFilter(this.employments, chip);
  }

  onBindingFilter(array: Filter[], chip: string) {
    let isAnyElement = false;

    array.forEach(element => {
      if (element.name === chip) {
        element.selected = false;
      }
      if (element.selected) {
        isAnyElement = true;
      }
    });

    // If there's no selected element, 'All' is checked.
    if (!isAnyElement) {
      array[0].selected = true;
    }
  }

  onApply(jobId: String) {
    this._router.navigate(['/jobs', jobId]);
  }

  sortData(sort: Sort) {
    const data = this.jobs.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedJobs = data;
      return;
    }

    this.sortedJobs = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'role': return compare(a.title, b.title, isAsc);
        case 'location': return compare(a.location, b.location, isAsc);
        case 'experience': return compare(a.experience, b.experience, isAsc);
        case 'education': return compare(a.education, b.education, isAsc);
        case 'employment': return compare(a.employment, b.employment, isAsc);
        case 'onBoard': return compare(a.onBoardStart, b.onBoardStart, isAsc);
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

  onJobDetail(id: string, applied: boolean) {
    if (!applied) {
      window.open('/jobs/' + id);
    }
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
