import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsPaginationComponent } from './ws-pagination.component';

describe('WsPaginationComponent', () => {
  let component: WsPaginationComponent;
  let fixture: ComponentFixture<WsPaginationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
