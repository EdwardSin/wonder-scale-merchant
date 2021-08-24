import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeControlComponent } from './home-control.component';

describe('HomeControlComponent', () => {
  let component: HomeControlComponent;
  let fixture: ComponentFixture<HomeControlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
