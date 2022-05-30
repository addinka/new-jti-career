import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Filter } from 'src/app/core/models/filter.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Output() all = new EventEmitter();
  @Output() unSelect = new EventEmitter();

  @Input() item: Filter;
  @Input() type: string;
  @Input() index: number;

  constructor() { }

  ngOnInit() {
  }

  onSelectFilter() {
    if (this.index === 0) {
      this.all.emit({
          type: this.type,
          isAll: true,
          name: this.item.name
        });
      this.unSelect.emit({
        type: this.type,
        name: this.item.name
      });
    } else {
      this.all.emit({
          type: this.type,
          isAll: false,
          name: this.item.name
        });
      this.item.selected = !this.item.selected;
      if (!this.item.selected) {
        this.unSelect.emit({
          type: this.type,
          name: this.item.name
        });
      }
    }
  }

}
