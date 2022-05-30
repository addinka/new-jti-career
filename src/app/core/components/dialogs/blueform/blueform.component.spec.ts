import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBlueFormComponent } from './blueform.component';

describe('SendBlueFormComponent', () => {
  let component: SendBlueFormComponent;
  let fixture: ComponentFixture<SendBlueFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendBlueFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendBlueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
