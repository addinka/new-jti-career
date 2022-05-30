import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteExternalComponent } from './invite-external.component';

describe('InviteExternalComponent', () => {
  let component: InviteExternalComponent;
  let fixture: ComponentFixture<InviteExternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteExternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
