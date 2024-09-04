import { Component, Input } from '@angular/core';
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
  
  @Input() euclideanMap: any; // L'ultima coordinata dice se è sz o meno

  tableSolutionsService: TableSolutionsService;

  constructor(tableSolutionsService: TableSolutionsService) {
    this.tableSolutionsService = tableSolutionsService;

    // // Generating a Matrix + Solution
    // let euclideanMap = this.tableSolutionsService.createMapOfLettersNumbers();

    // // setting it as euclidean map
    // this.euclideanMap = euclideanMap;

    // // Extracting the solution
    // let tryToGetSolution = this.tableSolutionsService.findTrueValues(euclideanMap);
    // console.log("EXTRACTED SOLUTION: ");
    // console.log(tryToGetSolution)

    // // Setting the solution in tableServiceSolutions 
    // this.tableSolutionsService.setSolution(tryToGetSolution);
    // console.log("solutions is ")
    // console.log(this.tableSolutionsService.solution)

   }




  public getFakeArray() {
    return new Array(this.cellSize)
  }


}
