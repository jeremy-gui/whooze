import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateorjoinpartieComponent } from './createorjoinpartie.component';

describe('CreateorjoinpartieComponent', () => {
  let component: CreateorjoinpartieComponent;
  let fixture: ComponentFixture<CreateorjoinpartieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateorjoinpartieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateorjoinpartieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
