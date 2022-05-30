import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitBlueformComponent } from './submit-blueform.component';

describe('SubmitBlueformComponent', () => {
  let component: SubmitBlueformComponent;
  let fixture: ComponentFixture<SubmitBlueformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitBlueformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitBlueformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
