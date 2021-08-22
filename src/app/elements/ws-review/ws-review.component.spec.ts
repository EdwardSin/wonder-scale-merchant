import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsReviewComponent } from './ws-review.component';

describe('WsReviewComponent', () => {
  let component: WsReviewComponent;
  let fixture: ComponentFixture<WsReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
