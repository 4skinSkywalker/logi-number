import { Injectable } from '@angular/core';
import { UtilsManipulationService } from '../utilsManipulation/utils-manipulation.service';
import { LogicSolutionService } from '../logicSolution/logic-solution.service';

@Injectable({
  providedIn: 'root',  // è un singleton. Per iniettarlo basta solo mettere l'argomento nel costruttore di un componente, senza strane annotazioni! 
})
export class TableSolutionsService {

  dimension = 3; 
  solution: string[] = [];
  letters = ["A", "B", "C"];
  numbers = [1, 2, 3]
  mapCoordinates = new Map<string, string>();  // most important in frontend 
  clues: string[] = [];

  utilsManipulationService: UtilsManipulationService;
  logicSolutionService: LogicSolutionService;

  constructor(utilsManipulationService: UtilsManipulationService, logicSolutionService: LogicSolutionService) {
    this.utilsManipulationService = utilsManipulationService;
    this.logicSolutionService = logicSolutionService;

    this.getNewGame();
    
  }


  getNewGame() {
    let newGame = this.logicSolutionService.startGame(this.dimension);
    this.letters = newGame["letters"];
    this.numbers = newGame["numbers"];
    this.solution = newGame["solution"];

    

    this.mapCoordinates = this.utilsManipulationService.generateHashMapCoordinates(this.letters, this.numbers);
    this.clues = newGame["clues"];

    console.log(`letters: ${this.letters}, numbers: ${this.numbers}, solution: ${this.solution}, clues: ${this.clues}`)
  }

  // createLetterArrays(letters: string[]) {
  //   const result = [];
  //   const maxLength = letters.length;

  //   for (const letter of letters) {
  //     const letterArray = [];
  //     for (let i = 1; i <= maxLength; i++) {
  //       letterArray.push([letter, i, i === letters.indexOf(letter) + 1]);
  //     }
  //     result.push(letterArray);
  //   }

  //   return result;
  // }

  // createMapOfLettersNumbers() {
  //   let arrayOfLetters = this.utilsManipulationService.pickUnique(this.LETTERS, this.dimension);
  //   console.log("chosen letters: " + arrayOfLetters)
  //   let result = this.createLetterArrays(arrayOfLetters);

  //   console.log("MAP OF LETTERS CREATED:")
  //   console.log(result)

  //   return result;
  // }

  isThereAlreadyGreenInCross(coordinates: string): boolean {
    // assuming coordinates of the format "A.1"
    // return true if there is already a green in the cross, false otherwise
    return this.utilsManipulationService.isThereAlreadyGreenInTheCross(this.mapCoordinates, this.letters, this.numbers, coordinates);
  }

  checkIfSolution(): boolean {
    return this.utilsManipulationService.determineIfSolutionSolve(this.mapCoordinates, this.solution)
  }

  resetMapCoordinates(): void {
    let keys = this.mapCoordinates.keys();
    for(let key of keys) {
      this.mapCoordinates.set(key, "white");
    }
  }

}