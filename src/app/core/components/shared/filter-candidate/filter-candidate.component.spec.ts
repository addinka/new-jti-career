import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCandidateComponent } from './filter-candidate.component';

describe('FilterCandidateComponent', () => {
  let component: FilterCandidateComponent;
  let fixture: ComponentFixture<FilterCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
