import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RecruiterService } from 'src/app/core/services/recruiter.service';
import { Author } from 'src/app/core/models/author.model';
import { BASE_URL } from '../../../utils/constant';
import { FormGroup, FormBuilder } from '@angular/forms';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-edit-collaborators',
  templateUrl: './edit-collaborators.component.html',
  styleUrls: ['./edit-collaborators.component.scss']
})
export class EditCollaboratorsComponent implements OnInit {
  authors: Author[] = [];
  public updatedCollaborators: FormGroup;
  public updatedCollaboratorId: string[] = [];
  public currentId: string;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private recruiterService: RecruiterService,
    public dialogRef: MatDialogRef<EditCollaboratorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentId = localStorage.getItem('id');
    dialogRef.disableClose = true;
    this.updatedCollaborators = this.fb.group({
      id: [''],
      collaboratorIds: ['']
    });
  }

  ngOnInit() {
    this.getAuthors();

    this.authors.forEach(author => {
      this.data.job.collaborators.forEach((collaborator: string) => {
        if (author._id.includes(collaborator)) {
          author.selected = true;
        }
      });
    });
  }

  getAuthors() {
    this.recruiterService.getRecruiters()
      .subscribe(author => {
        for (let i = 0; i < author.docs.length; i++) {
          this.authors.push(new Author(
            author.docs[i].name,
            BASE_URL + author.docs[i].profpic,
            author.docs[i]._id,
            false
          ));
        }
      });
  }

  selectAuthor(index: number) {
  }

  close(): void {
    this.dialogRef.close();
  }

  update(): void {
    this.authors.forEach(element => {
      if (element.selected === true) {
        this.updatedCollaboratorId.push(element._id);
      }
    });

    this.updatedCollaborators.patchValue({
      id: this.data.job.jobID,
      collaboratorIds: this.updatedCollaboratorId
    });

    this.onChangeCollaborators(this.updatedCollaborators.value);
  }

  onChangeCollaborators(data: any) {
    this.jobService.changeCollaborators(data)
      .subscribe(response => {
        // console.log(response);
        this.close();
      });
  }
}
