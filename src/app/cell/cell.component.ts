import { booleanAttribute, Component, Input, numberAttribute } from '@angular/core';
import { TableSolutionsService } from '../services/table-solutions.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})
export class CellComponent {

  @Input({transform: booleanAttribute}) solution: boolean | undefined;
  @Input() xCoordinate: string | undefined;
  @Input({transform: numberAttribute}) yCoordinate: number | undefined;

  cellSize = 2;
  clickedCounter = 0;

  tableSolutionsService: TableSolutionsService;

  constructor(tableSolutionsService: TableSolutionsService) {
    this.tableSolutionsService = tableSolutionsService;
    console.log(this.tableSolutionsService.value)
  }

  public cellClicked(event: any) {
    this.clickedCounter = (this.clickedCounter + 1) % 3;
    console.log("X: " + this.xCoordinate, " Y: " + this.yCoordinate);

    if(this.clickedCounter == 1 && this.xCoordinate!=undefined && this.yCoordinate!=undefined) {
      this.tableSolutionsService.pushSelectedCell([this.xCoordinate, this.yCoordinate]);
    }

    if((this.clickedCounter == 2 || this.clickedCounter == 0) && this.xCoordinate!=undefined && this.yCoordinate!=undefined) {
      this.tableSolutionsService.removeSelectedCell([this.xCoordinate, this.yCoordinate]);
    }


  }




}
