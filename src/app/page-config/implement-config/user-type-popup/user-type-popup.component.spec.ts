import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTypePopupComponent } from './user-type-popup.component';

describe('UserTypePopupComponent', () => {
  let component: UserTypePopupComponent;
  let fixture: ComponentFixture<UserTypePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTypePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTypePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
