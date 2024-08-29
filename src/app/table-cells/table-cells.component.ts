import { Component } from '@angular/core';
import { TableSolutionsService } from '../services/table-solutions.service';
import { table } from 'console';

@Component({
  selector: 'app-table-cells',
  templateUrl: './table-cells.component.html',
  styleUrl: './table-cells.component.css'
})


export class TableCellsComponent {
  // dimension = 5;
  cellSize = 2;
  euclideanMap = [[["A", 1, true], ["A", 2, false], ["A", 3, false]], [["B", 1, false], ["B", 2, true], ["B", 3, false]],
  [["C", 1, false], ["C", 2, false], ["C", 3, true]]] // L'ultima coordinata dice se è sz o meno

  tableSolutionsService: TableSolutionsService;

  constructor(tableSolutionsService: TableSolutionsService) {
    this.tableSolutionsService = tableSolutionsService;

    console.log(this.tableSolutionsService.value);
   }

  public getFakeArray() {
    return new Array(this.cellSize)
  }


}
