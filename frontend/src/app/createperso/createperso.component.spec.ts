import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatepersoComponent } from './createperso.component';

describe('CreatepersoComponent', () => {
  let component: CreatepersoComponent;
  let fixture: ComponentFixture<CreatepersoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatepersoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatepersoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
