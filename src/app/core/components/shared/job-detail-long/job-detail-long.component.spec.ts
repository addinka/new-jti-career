import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailLongComponent } from './job-detail-long.component';

describe('JobDetailLongComponent', () => {
  let component: JobDetailLongComponent;
  let fixture: ComponentFixture<JobDetailLongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDetailLongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailLongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
