import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOnboardformComponent } from './view-onboardform.component';

describe('ViewOnboardformComponent', () => {
  let component: ViewOnboardformComponent;
  let fixture: ComponentFixture<ViewOnboardformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOnboardformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOnboardformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
