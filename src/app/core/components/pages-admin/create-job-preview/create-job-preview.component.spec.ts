import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobPreviewComponent } from './create-job-preview.component';

describe('CreateJobPreviewComponent', () => {
  let component: CreateJobPreviewComponent;
  let fixture: ComponentFixture<CreateJobPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateJobPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJobPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
