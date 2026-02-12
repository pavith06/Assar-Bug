import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadHistoryPopupComponent } from './upload-history-popup.component';

describe('UploadHistoryPopupComponent', () => {
  let component: UploadHistoryPopupComponent;
  let fixture: ComponentFixture<UploadHistoryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadHistoryPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadHistoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
