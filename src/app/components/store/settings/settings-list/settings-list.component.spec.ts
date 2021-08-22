import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsListComponent } from './settings-list.component';

describe('SettingsListComponent', () => {
  let component: SettingsListComponent;
  let fixture: ComponentFixture<SettingsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
