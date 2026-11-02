import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheendComponent } from './theend.component';

describe('TheendComponent', () => {
  let component: TheendComponent;
  let fixture: ComponentFixture<TheendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
