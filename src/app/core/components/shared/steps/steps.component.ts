import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.css']
})
export class StepsComponent implements OnInit {

  @Input() steps: any;
  constructor() { }

  ngOnInit() {
    // console.log(this.steps);
  }


}
