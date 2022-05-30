import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitOnboardingFormComponent } from './submit-onboarding-form.component';

describe('SubmitOnboardingFormComponent', () => {
  let component: SubmitOnboardingFormComponent;
  let fixture: ComponentFixture<SubmitOnboardingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitOnboardingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitOnboardingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
