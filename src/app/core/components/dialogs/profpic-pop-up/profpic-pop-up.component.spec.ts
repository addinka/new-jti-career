import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfpicPopUpComponent } from './profpic-pop-up.component';

describe('ProfpicPopUpComponent', () => {
  let component: ProfpicPopUpComponent;
  let fixture: ComponentFixture<ProfpicPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfpicPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfpicPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
