import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageSubscriptionComponent } from './package-subscription.component';

describe('PackageSubscriptionComponent', () => {
  let component: PackageSubscriptionComponent;
  let fixture: ComponentFixture<PackageSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
