import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishItemsComponent } from './publish-items.component';

describe('PublishItemsComponent', () => {
  let component: PublishItemsComponent;
  let fixture: ComponentFixture<PublishItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
