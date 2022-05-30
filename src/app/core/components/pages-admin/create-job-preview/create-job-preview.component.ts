import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/core/services/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JobDetailModel } from 'src/app/core/models/job.detail.model';
import { Messages, BASE_URL } from 'src/app/core/utils/constant';
import { Author } from 'src/app/core/models/author.model';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-create-job-preview',
  templateUrl: './create-job-preview.component.html',
  styleUrls: ['./create-job-preview.component.scss']
})
export class CreateJobPreviewComponent implements OnInit {
  public job: JobDetailModel;
  public isNotFound: boolean;
  public isPreview: boolean;
  public message: String;
  public isApplied: boolean;
  public authorAvatar: string;
  public authorName: string;
  public currentID: string;
  public isSuperAdmin: string;
  public collaboratorProfile: Author[] = [];

  constructor(
    private dialog: DialogService,
    private activatedRoute: ActivatedRoute,
    private jobService: JobService,
    private route: ActivatedRoute) {

    // activatedRoute.queryParams.subscribe(
    //   params => {
    //     this.job = {
    //       title: params['title'],
    //       categories: params['category'],
    //       location: params['location'],
    //       onBoardStart: params['onBoard'],
    //       language: params['language'],
    //       experience: params['experience'],
    //       education: params['education'],
    //       employment: params['employment'],
    //       jobDesc: params['description'],
    //       requirement: params['requirement'],
    //       benefits: params['benefit']
    //     };
    //     // console.log(this.job.jobDesc)
    //     // console.log(this.job.requirement)
    //   });

    this.isNotFound = false;
    this.isApplied = false;
    this.message = Messages.JOB_NOT_FOUND;
    this.currentID = localStorage.getItem('id');
    this.isSuperAdmin = localStorage.getItem('isSuperAdmin');
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];

    if (id !== 'preview') {
      this.onGetJobById(id);
      this.isPreview = false;
    } else {
      this.job = JSON.parse(localStorage.getItem("previewData"));
      this.isPreview = true;
    }
  }

  onGetJobById(id: string) {
    this.jobService.getJobDetail(id)
      .subscribe(
        res => {
          // console.log('res', res);
          this.job = res;
          this.isNotFound = false;

          // Set author profile URL
          this.authorAvatar = BASE_URL + this.job.authorProfile.profpic;
          this.authorName = this.job.authorProfile.name;

          // Set collaborators profile URL
          for (let i = 0; i < this.job.collaborators.length; i++) {
            this.collaboratorProfile.push(
              new Author(
                this.job.collaboratorProfiles[i].name,
                BASE_URL + this.job.collaboratorProfiles[i].profpic,
                this.job.collaboratorProfiles[i]._id,
                false
              )
            );
          }
        },
        error => {
          // console.log(error);
          this.isNotFound = true;
        });
  }

  editAuthor() {
    const dialogRef = this.dialog.getEditAuthorDialog(this.job);

    dialogRef.afterClosed().subscribe(result => {
      this.collaboratorProfile = [];
      this.onGetJobById(this.job.jobID);
    });
  }

  editCollaborators() {
    const dialogRef = this.dialog.getEditCollaboratorDialog(this.job);

    dialogRef.afterClosed().subscribe(result => {
      this.collaboratorProfile = [];
      this.onGetJobById(this.job.jobID);
    });
  }
}
