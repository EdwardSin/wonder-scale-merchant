import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpublishedItemsComponent } from './unpublished-items.component';

describe('UnpublishedItemsComponent', () => {
  let component: UnpublishedItemsComponent;
  let fixture: ComponentFixture<UnpublishedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnpublishedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpublishedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
