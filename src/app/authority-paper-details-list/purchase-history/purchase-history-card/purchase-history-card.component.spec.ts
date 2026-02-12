import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseHistoryCardComponent } from './purchase-history-card.component';

describe('PurchaseHistoryCardComponent', () => {
  let component: PurchaseHistoryCardComponent;
  let fixture: ComponentFixture<PurchaseHistoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseHistoryCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseHistoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
