import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuredDetailComponent } from './insured-detail.component';

describe('InsuredDetailComponent', () => {
  let component: InsuredDetailComponent;
  let fixture: ComponentFixture<InsuredDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuredDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuredDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
