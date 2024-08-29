import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',  // è un singleton. Per iniettarlo basta solo mettere l'argomento nel costruttore di un componente, senza strane annotazioni! 
})
export class TableSolutionsService {

  fullLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

  dimension = 3;
  letters = ["A", "B", "C"];
  numbers = [1, 2, 3]
  value: number;
  selectedCells = new Map<string, number>();
  solution: [string, number][] = [];

  constructor() {
    this.value = Math.random();
    this.solution = [["A", 1], ["B", 2], ["C", 3]];
  }


  increaseDimension() {
    this.dimension++;
    return this.dimension;
  }

  decreaseDimension() {
    this.dimension--;
    return this.dimension;
  }


  pushSelectedCell(input: [string, number]) {
    this.selectedCells.set(input[0], input[1]);
    console.log("selectedCells:" );
    console.log(this.selectedCells);
  }


  removeSelectedCell(elementToRemove: [string,number]) {
    
    let isTheLetterAlreadyThere = this.selectedCells.has(elementToRemove[0])
    if(isTheLetterAlreadyThere) {
      let coordinateNumber = this.selectedCells.get(elementToRemove[0]);
      if (coordinateNumber == elementToRemove[1]) {
        this.selectedCells.delete(elementToRemove[0]);
      }
    }
    
    console.log("selectedCells:" );
    console.log(this.selectedCells);
  }

}