import { Component, OnInit, Input } from '@angular/core';
import { Messages } from 'src/app/core/utils/constant';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  @Input() message: String;

  constructor() { }

  ngOnInit() {
    if (this.message === undefined) {
      this.message = Messages.PAGE_NOT_FOUND;
    }
  }

}
