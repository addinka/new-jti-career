import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAllCandidateComponent } from './filter-all-candidate.component';

describe('FilterAllCandidateComponent', () => {
  let component: FilterAllCandidateComponent;
  let fixture: ComponentFixture<FilterAllCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterAllCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterAllCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
