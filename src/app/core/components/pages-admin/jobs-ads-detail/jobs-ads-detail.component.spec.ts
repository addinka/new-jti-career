import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsAdsDetailComponent } from './jobs-ads-detail.component';

describe('JobsAdsDetailComponent', () => {
  let component: JobsAdsDetailComponent;
  let fixture: ComponentFixture<JobsAdsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsAdsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsAdsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
