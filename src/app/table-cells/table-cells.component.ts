import { Component, Input } from '@angular/core';
import { TableSolutionsService } from '../services/tableSolution/table-solutions.service';

@Component({
  selector: 'app-table-cells',
  templateUrl: './table-cells.component.html',
  styleUrl: './table-cells.component.css'
})

export class TableCellsComponent {

  
  tableSolutionsService: TableSolutionsService;

  constructor(tableSolutionsService: TableSolutionsService) {
    this.tableSolutionsService = tableSolutionsService;
  }

}
