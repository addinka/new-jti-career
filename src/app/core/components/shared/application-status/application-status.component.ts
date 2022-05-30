import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.scss']
})
export class ApplicationStatusComponent implements OnInit {
  @Input() total: number;
  @Input() status: String;

  constructor() { }

  ngOnInit() {
  }

}
