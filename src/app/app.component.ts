import { Component, ViewChild } from '@angular/core';
import { TableSolutionsService } from './services/tableSolution/table-solutions.service';
import { UtilsManipulationService } from './services/utilsManipulation/utils-manipulation.service';

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
  utilsManipulationService: UtilsManipulationService;

  constructor(tableSolutionsService: TableSolutionsService, utilsManipulationService: UtilsManipulationService) {
    this.tableSolutionsService = tableSolutionsService;
    this.utilsManipulationService = utilsManipulationService;

    // Testing 
    // let LETTERS = "QWERTYUIOPASDFGHJKLZCVBNM";
    // let result = this.utilsManipulationService.pickUnique(LETTERS, 10);
    // console.log(result);
    // console.log(`result is: ${result}`);
    // console.log(result);

    // 2. 
    // let result = this.utilsManipulationService.generateHashMapCoordinates(["A","B","C"], [1,2,3])
    // this.utilsManipulationService.changeColorValue(result, "A", 1, "green");
    // this.utilsManipulationService.changeColorValue(result, "B", 2, "green");
    // this.utilsManipulationService.changeColorValue(result, "C", 3, "green");
    // console.log(result);

    // let allGreens = this.utilsManipulationService.determineAllGreenInMap(result);
    // console.log(allGreens)

    // let fakeSolution = ["A.1","B.3","C.2"]
    // console.log(`fakeSolution: ${fakeSolution}`)
    // let isSolution = this.utilsManipulationService.determineIfSolutionSolve(result, fakeSolution)
    // console.log(`is solution? ${isSolution}`);

    // 3. 
    // let result = this.utilsManipulationService.generateHashMapCoordinates(["A","B","C"], [1,2,3])
    // //this.utilsManipulationService.changeColorValue(result, "A", 1, "green");
    // //this.utilsManipulationService.changeColorValue(result, "B", 2, "green");
    // this.utilsManipulationService.changeColorValue(result, "B", 1, "green");
    // console.log(result);

    // let isThereAlreadyGreenInCross = this.utilsManipulationService.isThereAlreadyGreenInTheCross(result, ["A","B","C"], [1,2,3], "A.1")
    // console.log(`isThereAGreenInTheCross: ${isThereAlreadyGreenInCross}`)


  }

  public check(event: any) {
    console.log("check pressed");

    let doWeHaveSolution = this.tableSolutionsService.checkIfSolution();

    console.log("do we have solution? " + doWeHaveSolution);

    if (doWeHaveSolution) {
      alert("YOU SOLVED THE PUZZLE!!")
    } else {
      alert("not correct...")
    }
  }


  public increase(event: any) {
    this.tableSolutionsService.dimension++;
  }

  public decrease(event: any) {
    this.tableSolutionsService.dimension++;
  }

  public init(eveny: any) {

    // // emptying selected cells
    // this.tableSolutionsService.resetSelectedCells();

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

  public reset(event: any) {
    this.tableSolutionsService.resetMapCoordinates();
  }

}
