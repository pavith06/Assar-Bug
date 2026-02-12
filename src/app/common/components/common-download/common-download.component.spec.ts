import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDownloadComponent } from './common-download.component';

describe('CommonDownloadComponent', () => {
  let component: CommonDownloadComponent;
  let fixture: ComponentFixture<CommonDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonDownloadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
