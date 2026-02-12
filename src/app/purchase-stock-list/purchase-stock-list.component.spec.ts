import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseStockListComponent } from './purchase-stock-list.component';

describe('PurchaseStockListComponent', () => {
  let component: PurchaseStockListComponent;
  let fixture: ComponentFixture<PurchaseStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseStockListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
