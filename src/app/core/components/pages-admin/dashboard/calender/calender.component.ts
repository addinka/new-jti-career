import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationService } from 'src/app/core/services/application.service';
import { CalenderModel } from 'src/app/core/models/calender.model';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {
  @Input() currentDate: Date;
  @Input() isoDate: string;
  @Output() selectDate = new EventEmitter();
  @Output() error = new EventEmitter();

  weekNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  public calender: CalenderModel[];

  public activeDate: number;
  public activeMonth: number;
  public activeYear: number;

  public showingDate: Date;
  public showingMonth: number;

  public init: boolean;

  constructor(private applicationService: ApplicationService) {
    this.calender = [];
    this.init = true;
  }

  ngOnInit() {
    this.activeDate = this.currentDate.getDate();
    this.activeMonth = this.currentDate.getMonth() + 1;
    this.activeYear = this.currentDate.getFullYear();
    this.onGetCalender(this.activeYear + '-' + this.activeMonth);

    this.showingDate = this.currentDate;
    this.showingMonth = this.currentDate.getMonth();
  }

  onGetCalender(date: string) {
    this.applicationService.getApplicationCalender(date)
      .subscribe(
        response => {
          this.calender = [];
          response.forEach((element: any) => {
            let selected = false;
            if (element.date === this.activeDate && this.init) {
              selected = true;
              this.init = !this.init;
            }
            this.calender.push(new CalenderModel(
              element.date,
              element.iso,
              element.type,
              element.event,
              selected
            ));
          });
          // // console.log(this.calender);

        },
        error => {
          // console.log(error);
          this.error.emit();
        });
  }

  onSelectDate(iso: string) {
    this.selectDate.emit(iso);
  }

  onSelectMonth(type: string) {
    this.showingDate = new Date();

    if (type === 'previous') {
      this.showingMonth -= 1;
    } else {
      this.showingMonth += 1;
    }

    this.showingDate.setMonth(this.showingMonth);

    const year = this.showingDate.getFullYear();
    this.onGetCalender(year + '-' + (this.showingMonth + 1));
  }
}
