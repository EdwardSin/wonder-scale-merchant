import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedItemsComponent } from './published-items.component';

describe('PublishedItemsComponent', () => {
  let component: PublishedItemsComponent;
  let fixture: ComponentFixture<PublishedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
