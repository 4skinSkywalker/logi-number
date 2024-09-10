import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCellsComponent } from './table-cells.component';

describe('TableCellsComponent', () => {
  let component: TableCellsComponent;
  let fixture: ComponentFixture<TableCellsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableCellsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
