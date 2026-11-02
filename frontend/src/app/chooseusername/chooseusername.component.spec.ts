import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseusernameComponent } from './chooseusername.component';

describe('ChooseusernameComponent', () => {
  let component: ChooseusernameComponent;
  let fixture: ComponentFixture<ChooseusernameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseusernameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseusernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
