import { Component, ViewChild } from '@angular/core';
import { TableSolutionsService } from './services/table-solutions.service';
import { TableCellsComponent } from './table-cells/table-cells.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  
  title = 'logi-number';
  euclideanMap = [[["A", 1, true], ["A", 2, false], ["A", 3, false]], [["B", 1, false], ["B", 2, true], ["B", 3, false]],
  [["C", 1, false], ["C", 2, false], ["C", 3, true]]];

  tableSolutionsService: TableSolutionsService;

  constructor(tableSolutionsService: TableSolutionsService) {
    this.tableSolutionsService = tableSolutionsService;
  }

  public check(event: any) {
    console.log("check pressed");

    let doWeHaveSolution = this.tableSolutionsService.checkIfIsSolution();

    console.log("do we have solution? " + doWeHaveSolution);

    if(doWeHaveSolution) {
      alert("YOU SOLVED THE PUZZLE!!")
    } else {
      alert("not correct...")
    }
  }
  

  public increase(event: any) {
    this.tableSolutionsService.increaseDimension();
  }

  public decrease(event: any) {
    this.tableSolutionsService.decreaseDimension();
  }

  public init(eveny: any) {

    // emptying selected cells
    this.tableSolutionsService.resetSelectedCells();

    // Generating a Matrix + Solution
    let euclideanMap = this.tableSolutionsService.createMapOfLettersNumbers();

    // setting it as euclidean map
    this.euclideanMap = euclideanMap;

    // Extracting the solution
    let tryToGetSolution = this.tableSolutionsService.findTrueValues(euclideanMap);
    console.log("EXTRACTED SOLUTION: ");
    console.log(tryToGetSolution)

    // Setting the solution in tableServiceSolutions 
    this.tableSolutionsService.setSolution(tryToGetSolution);
    console.log("solutions is ")
    console.log(this.tableSolutionsService.solution)
  }

  public reset(event: any) {

      console.log("reset clicked")

      // emptying selected cells
      this.tableSolutionsService.resetSelectedCells();

      // Cambio il valore di euclideanMap a [] e lo faccio tornare a prima solo per forzare il rerendering!
      
      let euclideanMap = this.euclideanMap;
      this.euclideanMap = [];
      this.euclideanMap = euclideanMap;
  }

}
