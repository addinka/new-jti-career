import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvIndicatorComponent } from './cv-indicator.component';

describe('CvIndicatorComponent', () => {
  let component: CvIndicatorComponent;
  let fixture: ComponentFixture<CvIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
