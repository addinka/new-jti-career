import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { Arrays, BASE_URL } from 'src/app/core/utils/constant';
import { JobService } from 'src/app/core/services/job.service';
import { EditCollaboratorsComponent } from '../../dialogs/edit-collaborators/edit-collaborators.component';
import { DialogService } from 'src/app/core/services/dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jobs-ads',
  templateUrl: './jobs-ads.component.html',
  styleUrls: ['./jobs-ads.component.scss']
})
export class JobsAdsComponent implements OnInit {
  entriesItems = [];
  jobsAds = [];
  sortedJobsAds = [];
  sorts = [
    'default', 'asc', 'dsc'
  ];
  sort = this.sorts[0];

  jobsCount = 0;
  entriesCount = 0;
  pagesCount = 0;
  select: string;
  today = new Date();

  getImageURL: string;
  isCollaborator: any = [];

  currentId = localStorage.getItem('id');

  public search: string;

  constructor(
    private jobService: JobService,
    private dialog: DialogService,
    private router: Router) {
      this.getImageURL = BASE_URL;
  }

  ngOnInit() {
    this.entriesItems = Arrays.ENTRY;
    this.select = this.entriesItems[0];

    this.onGetJob('1', this.entriesItems[0]);
  }

  onGetJob(page: string, entries: string) {
    this.jobService.getJobs(page, entries)
      .subscribe(jobs => {
        const data = jobs.rows;
        console.log(data);
        // Set jobs count.
        this.jobsCount = jobs.total_rows;

        // Reinitialize jobs and entries count.
        this.jobsAds = [];
        this.sortedJobsAds = [];
        this.entriesCount = 0;

        // Push jobs.
        data.forEach((element, index) => {
          const el = element.value;

          let expired: boolean;

          if (new Date(el.liveEnd) < this.today) {
            expired = true;
          } else {
            expired = false;
          }

          this.jobsAds.push({
            'id': el._id,
            'date': el.liveEnd,
            'expired': expired,
            'title': el.title,
            'status': el.status,
            'jobID': el.jobID,
            'author': el.author,
            'authorProfile': el.authorProfile.profpic,
            'authorName': el.authorProfile.name,
            'collaborators': el.collaborators,
            'countApplied': el.appliCount.count_applied,
            'countShortlist': el.appliCount.count_shortlist,
            'countTest': el.appliCount.count_test,
            'countInterview1': el.appliCount.count_inter1,
            'countInterview2': el.appliCount.count_inter2,
            'countOnBoard': el.appliCount.count_hired,
            'countRejected': el.appliCount.count_rejected,
            'countWithdrawn': el.appliCount.count_withdrawn,
            'countEliminated': el.appliCount.count_eliminated,
            'isFollow': element.followed,
          });

          this.sortedJobsAds = this.jobsAds.slice();

          this.entriesCount += 1;

          this.pagesCount = Math.ceil(this.jobsCount / Number(this.select));
        });

        // console.log(this.sortedJobsAds)
      });
  }

  onRepostJob(id: string) {
    this.jobService.repostJob(id)
      .subscribe(response => {
        this.onGetJob('1', this.select);
      });
  }

  followJobs(id: string){
    // console.log(id);  

    this.jobService.toggleFollowJob(id)
      .subscribe(response => {
        this.onGetJob('1', this.select);
      });
  }

  onSelect(value: any) {
    this.select = value;
    this.onGetJob('1', value);
  }

  onSortArrow(sort: string) {
    switch (sort) {
      case this.sorts[0]:
        this.sort = this.sorts[1];
        break;
      case this.sorts[1]:
        this.sort = this.sorts[2];
        break;
      case this.sorts[2]:
        this.sort = this.sorts[0];
        break;
      default:
        break;
    }
  }

  sortData(sort: Sort) {
    const data = this.jobsAds.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedJobsAds = data;
      return;
    }

    // this.sortedJobsAds = data.sort((a, b) => {
    //   const isAsc = sort.direction === 'asc';
    //   switch (sort.active) {
    //     case 'role': return compare(a, b, isAsc);
    //     default: return 0;
    //   }
    // });
  }

  getRowClass(index: number) {

    if (index % 2 === 0) {
        return 'td-even';
      } else {
        return 'td-odd';
      }
  }

  getJobActionClass(expired: boolean, status: string, action: String) {

    if (expired) {
      if (action === 'Repost') {
        return 'jobs-action';
      } else {
        return 'jobs-action-disabled';
      }
    } else if (!expired) {
      if (status === 'CLOSED') {
        if (action === 'Deactivate') {
          return 'jobs-action';
        } else {
          return 'jobs-action-disabled';
        }
      } else if (status === 'OPEN') {
        if (action === 'Repost') {
          return 'jobs-action-disabled';
        } else {
          return 'jobs-action';
        }
      }
    }
  }

  getEditActionClass(collaborators: any) {
    const current = localStorage.getItem('id');
    let isCollaborator = false;

    collaborators.forEach((element, index) => {
      if (current === element) {
        isCollaborator = true;
      } else if (index === collaborators.length - 1 && current === element) {
        isCollaborator = false;
      }
    });

    if (isCollaborator) {
      return 'jobs-action';
    } else {
      return 'jobs-action-disabled';
    }
  }

  getEditActionDisable(collaborators: any) {
    const current = localStorage.getItem('id');
    let isCollaborator = false;

    collaborators.forEach((element, index) => {
      if (current === element) {
        isCollaborator = true;
      } else if (index === collaborators.length - 1 && current === element) {
        isCollaborator = false;
      }
    });

    if (isCollaborator) {
      return false;
    } else {
      return true;
    }
  }

  deactivateJob(id: string, index: number) {
    this.jobService.deactivateJob(id)
      .subscribe(res => {
        const status = this.sortedJobsAds[index].status;
        if (status === 'OPEN') {
          this.sortedJobsAds[index].status = 'CLOSED';
        } else {
          this.sortedJobsAds[index].status = 'OPEN';
        }
      });
  }

  editCollaborators(id: string, index: string) {
    const dialogRef = this.dialog.getEditCollaboratorDialog(this.jobsAds[index]);

    dialogRef.afterClosed().subscribe(result => {
      this.onGetJob('1', this.select);
    });
  }

  onViewJob(id: string) {
    window.open('/admin/jobs-ads/' + id);
  }

  onEditJob(id: string) {
    this.router.navigate(['admin/jobs-ads/edit', id]);
  }

  onSearch(){
    // this.page = 1;
    console.log(this.search);

    this.jobService.searchJobs('1', this.entriesItems[0], this.search)
      .subscribe(jobs => {
        const data = jobs.docs;
        // console.log(data);
        // Set jobs count.
        this.jobsCount = jobs.count;

        // Reinitialize jobs and entries count.
        this.jobsAds = [];
        this.sortedJobsAds = [];
        this.entriesCount = 0;

        // Push jobs.
        data.forEach((element, index) => {
          const el = element;
          let expired: boolean;

          if (new Date(el.liveEnd) < this.today) {
            expired = true;
          } else {
            expired = false;
          }

          this.jobsAds.push({
            'id': el._id,
            'date': el.liveEnd,
            'expired': expired,
            'title': el.title,
            'status': el.status,
            'jobID': el.jobID,
            'author': el.author,
            'authorProfile': el.authorProfile.profpic,
            'authorName': el.authorProfile.name,
            'collaborators': el.collaborators,
            'countApplied': el.appliCount.count_applied,
            'countShortlist': el.appliCount.count_shortlist,
            'countTest': el.appliCount.count_test,
            'countInterview1': el.appliCount.count_inter1,
            'countInterview2': el.appliCount.count_inter2,
            'countOnBoard': el.appliCount.count_hired,
            'countRejected': el.appliCount.count_rejected,
            'countWithdrawn': el.appliCount.count_withdrawn,
            'countEliminated': el.appliCount.count_eliminated,
            'isFollow': element.followed,
          });

          this.sortedJobsAds = this.jobsAds.slice();

          this.entriesCount += 1;

          this.pagesCount = Math.ceil(this.jobsCount / Number(this.select));
        });

        console.log(this.sortedJobsAds)
      });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
