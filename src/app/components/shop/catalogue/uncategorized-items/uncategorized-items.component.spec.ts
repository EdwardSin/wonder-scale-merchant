import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UncategorizedItemsComponent } from './uncategorized-items.component';

describe('UncategorizedItemsComponent', () => {
  let component: UncategorizedItemsComponent;
  let fixture: ComponentFixture<UncategorizedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UncategorizedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UncategorizedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
