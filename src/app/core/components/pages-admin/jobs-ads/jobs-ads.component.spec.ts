import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsAdsComponent } from './jobs-ads.component';

describe('JobsAdsComponent', () => {
  let component: JobsAdsComponent;
  let fixture: ComponentFixture<JobsAdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsAdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
