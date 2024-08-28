import { Component } from '@angular/core';

@Component({
  selector: 'app-table-cells',
  templateUrl: './table-cells.component.html',
  styleUrl: './table-cells.component.css'
})


export class TableCellsComponent {
  dimension = 5;
  cellSize = 2;
  euclideanMap = [[["A",1], ["A",2]], [["B",1], ["B",2]]]

  constructor() { }

  public getFakeArray() {
    return new Array(this.cellSize)
  }

}
