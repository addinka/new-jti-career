import { Component, Input, OnInit } from '@angular/core';
import { CV_COLOR } from 'src/app/core/utils/constant';

@Component({
  selector: 'cv-indicator',
  templateUrl: './cv-indicator.component.html',
  styleUrls: ['./cv-indicator.component.scss']
})
export class CvIndicatorComponent implements OnInit {

  @Input() color: string
  public cvColor = CV_COLOR;

  public tooltip = {
    green: "Updated in 1 month",
    yellow: "Not Updated in 1-3 months",
    red: "Not Updated in >3 months"
  }

  get tooltipText() {
    return this.tooltip[this.color];
  }

  constructor() { }

  ngOnInit() {
  }

}
