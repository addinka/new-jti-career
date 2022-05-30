import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { JobDetailModel } from 'src/app/core/models/job.detail.model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-detail-short',
  templateUrl: './job-detail-short.component.html',
  styleUrls: ['./job-detail-short.component.scss']
})
export class JobDetailShortComponent implements OnInit {
  @Input() job: JobDetailModel;
  @Input() isApplied: boolean;
  @Input() isPreview: boolean;
  @Input() id: any;
  @Output() applyAction: EventEmitter<boolean> = new EventEmitter();
  @Input() isWithdraw: boolean;
  @Input() isOnBoard: string;
  @Input() isRejected: string;


  constructor(
    private _router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  onApply(jobID: string) {
    if (!this.isApplied) {
      this._router.navigate(['jobs', jobID, 'apply']);
    } else {
      this.applyAction.emit(true);
    }
  }
}
