import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRecruiterComponent } from './delete-recruiter.component';

describe('DeleteRecruiterComponent', () => {
  let component: DeleteRecruiterComponent;
  let fixture: ComponentFixture<DeleteRecruiterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteRecruiterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
