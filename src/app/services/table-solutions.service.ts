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

  isThereAGreenInTheCross(input: [string | undefined, number | undefined]): boolean {
    let valuesIterator = this.selectedCells.values();
    let keysIterator = this.selectedCells.keys();

    for (let val of valuesIterator) {
      if(val == input[1]) {
        return true
      }
    }

    for (let key of keysIterator) {
      if(key == input[0]) {
        return true
      }
    }

    return false;
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


  checkIfIsSolution(): boolean {
    for(let cell of this.solution) {
      if(this.selectedCells.has(cell[0]) && (this.selectedCells.get(cell[0]) == cell[1])) {

      } else {
        return false;
      }
    }

    return true;
  }

}