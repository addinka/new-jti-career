import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-detail',
  templateUrl: './progress-detail.component.html',
  styleUrls: ['./progress-detail.component.scss']
})
export class ProgressDetailComponent implements OnInit {
  @Input() detail: any;
  @Input() index: number;

  public currentName: string;

  constructor() { }

  ngOnInit() {
    this.currentName = localStorage.getItem('name');
  }

}
