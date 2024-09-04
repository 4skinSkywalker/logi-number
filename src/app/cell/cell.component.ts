import { booleanAttribute, Component, Input, numberAttribute } from '@angular/core';
import { TableSolutionsService } from '../services/table-solutions.service';
import { table } from 'console';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})
export class CellComponent {

  @Input({ transform: booleanAttribute }) solution: boolean | undefined;
  @Input() xCoordinate: string | undefined;
  @Input({ transform: numberAttribute }) yCoordinate: number | undefined;

  cellSize = 2;
  clickedCounter = 0;

  tableSolutionsService: TableSolutionsService;

  constructor(tableSolutionsService: TableSolutionsService) {
    this.tableSolutionsService = tableSolutionsService;
    
  }

  public cellClicked(event: any) {

    let isThereAlreadyGreenInTheCross = this.tableSolutionsService.isThereAGreenInTheCross([this.xCoordinate, this.yCoordinate])

    // Controllo che nella Crose non ci siano già verdi. Se ci sono già verdi, la cella diventerà solo rossa o bianca
    if (isThereAlreadyGreenInTheCross) {
      this.clickedCounter = this.clickedCounter == 0 ? 2 : 0;
    } else {
      this.clickedCounter = (this.clickedCounter + 1) % 3;
    }

    console.log("X: " + this.xCoordinate, " Y: " + this.yCoordinate);

    // Se la cella è verde, vado ad inserirla nello stato: selectedCells
    if (this.clickedCounter == 1 && this.xCoordinate != undefined && this.yCoordinate != undefined) {
      this.tableSolutionsService.pushSelectedCell([this.xCoordinate, this.yCoordinate]);
    }

    // Se la cella era già nelle selectedCells e diventa rossa, la rimuovo dalle selectedCells
    if ((this.clickedCounter == 2 || this.clickedCounter == 0) && this.xCoordinate != undefined && this.yCoordinate != undefined) {
      this.tableSolutionsService.removeSelectedCell([this.xCoordinate, this.yCoordinate]);
    }

  }




}
