import { Component, OnInit, Input } from '@angular/core';
import { JobDetailModel } from 'src/app/core/models/job.detail.model';
@Component({
  selector: 'app-job-detail-long',
  templateUrl: './job-detail-long.component.html',
  styleUrls: ['./job-detail-long.component.scss']
})
export class JobDetailLongComponent implements OnInit {
  @Input() curStat: any;
  @Input() isApplied: boolean;
  @Input() job: JobDetailModel;

  constructor() { }

  ngOnInit() {
  }

}
