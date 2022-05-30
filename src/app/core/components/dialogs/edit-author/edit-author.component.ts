import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RecruiterService } from 'src/app/core/services/recruiter.service';
import { Author } from 'src/app/core/models/author.model';
import { BASE_URL } from '../../../utils/constant';
import { FormGroup, FormBuilder } from '@angular/forms';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-edit-author',
  templateUrl: './edit-author.component.html',
  styleUrls: ['./edit-author.component.scss']
})
export class EditAuthorComponent implements OnInit {
  authors: Author[] = [];
  public updatedAuthor: FormGroup;
  public updatedAuthorId: string;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private recruiterService: RecruiterService,
    public dialogRef: MatDialogRef<EditAuthorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
    this.updatedAuthor = this.fb.group({
      id: [''],
      authorId: ['']
    });
  }

  ngOnInit() {
    this.getAuthors();

    for (let i = 0; i < this.authors.length; i++) {
      if (this.authors[i]._id === this.data.job.author) {
        this.authors[i].selected = true;
      }
    }

  }

  getAuthors() {
    this.recruiterService.getRecruiters().subscribe(author => {
      for (let i = 0; i < author.docs.length; i++) {
        this.authors.push(
          new Author(
            author.docs[i].name,
            BASE_URL + author.docs[i].profpic,
            author.docs[i]._id,
            false
          )
        );
      }
    });
  }

  selectAuthor(index: number) {
    for (let i = 0; i < this.authors.length; i++) {
      this.authors[i].selected = false;
    }

    this.authors[index].selected = true;
    this.updatedAuthorId = this.authors[index]._id;
  }

  close(): void {
    this.dialogRef.close();
  }

  update(): void {
    this.updatedAuthor.patchValue({
      id: this.data.job.jobID,
      authorId: this.updatedAuthorId
    });

    this.onChangeAuthor(this.updatedAuthor.value);
  }

  onChangeAuthor(data: any) {
    this.jobService.changeAuthor(data)
      .subscribe(response => {
        // console.log(response);
        this.close();
      });
  }
}
