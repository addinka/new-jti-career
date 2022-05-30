import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HotRoles } from 'src/app/core/models/hot-roles.model';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-change-home',
  templateUrl: './change-home.component.html',
  styleUrls: ['./change-home.component.scss']
})
export class ChangeHomeComponent implements OnInit {
  availableRoles: HotRoles[];
  hotRoles: HotRoles[];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private jobService: JobService,
  ) {
    this.availableRoles = [];
    this.hotRoles = [];
  }

  ngOnInit() {
    this.document.body.classList.add("change-home");
    this.onGetHotRolesJob();
  }

  // onGetAvailableRolesJob() {
  //   this.jobService.getOpenJobs('','')
  //     .subscribe(response => {
  //       for (let i = 0; i < response.rows.length; i++) {
  //         let isExist = false;
  //         for (let j = 0; j < this.hotRoles.length; j++) {
  //           if (response.rows[i].value._id === this.hotRoles[j].id) {
  //             isExist = true;
  //           }
  //         }
  //         if (isExist === false) {
  //           this.availableRoles.push(new HotRoles(response.rows[i].value._id, response.rows[i].value.title));
  //         }
  //       }
  //     });
  // }

  onGetAvailableRolesJob() {
    this.jobService.getAvailableJobs()
      .subscribe(response => {
        // console.log(response);
        for (let i = 0; i < response.rows.length; i++) {
          if(response.rows[i].value.hotRole === "TRUE") {

          } else {
            this.availableRoles.push(new HotRoles(response.rows[i].value._id, response.rows[i].value.title, response.rows[i].value.hotRoleIndex));
          }
        }
      });
  }

  onGetHotRolesJob() {
    this.jobService.getHotRolesJobs()
      .subscribe(response => {
        for (let index = 0; index < 12; index++) {
          this.hotRoles.push(new HotRoles(null, null, null));
        }
        // console.log(response);
        for (let index = 0; index < response.rows.length; index++) {
          this.hotRoles[response.rows[index].value.hotRoleIndex].id = response.rows[index].value.jobID;
          this.hotRoles[response.rows[index].value.hotRoleIndex].name = response.rows[index].value.title;
          this.hotRoles[response.rows[index].value.hotRoleIndex].index = response.rows[index].value.hotRoleIndex;
        }
        
        this.onGetAvailableRolesJob();
      });
  }
}
