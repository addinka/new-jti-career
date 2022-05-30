import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailShortComponent } from './job-detail-short.component';

describe('JobDetailShortComponent', () => {
  let component: JobDetailShortComponent;
  let fixture: ComponentFixture<JobDetailShortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDetailShortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailShortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
