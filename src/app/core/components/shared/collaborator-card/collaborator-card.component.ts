import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-collaborator-card',
  templateUrl: './collaborator-card.component.html',
  styleUrls: ['./collaborator-card.component.scss']
})
export class CollaboratorCardComponent implements OnInit {
  @Input() author: any;
  @Input() index: any;
  @Input() currentId: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
      this.data.job.collaborators.forEach((collaborator: any) => {
        if (this.author._id === collaborator) {
          this.author.selected = true;
        }
      });
  }

  selectAuthor() {
    if (this.currentId === this.data.job.author) {
      if (this.author._id !== this.data.job.author) {
        this.author.selected = !this.author.selected;
      } else {
        this.author.selected = true;
      }
    }
  }
}

