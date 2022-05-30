import { Component, OnInit, Input } from '@angular/core';
import { Testimonial } from 'src/app/core/models/testimonial.model';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.css']
})
export class TestimonialComponent implements OnInit {
  @Input() testimonial: Testimonial;

  constructor() { }

  ngOnInit() {
  }

}
