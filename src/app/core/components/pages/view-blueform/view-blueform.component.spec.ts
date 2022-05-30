import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBlueformComponent } from './view-blueform.component';

describe('ViewBlueformComponent', () => {
  let component: ViewBlueformComponent;
  let fixture: ComponentFixture<ViewBlueformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBlueformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBlueformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
