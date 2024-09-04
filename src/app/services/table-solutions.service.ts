import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',  // è un singleton. Per iniettarlo basta solo mettere l'argomento nel costruttore di un componente, senza strane annotazioni! 
})
export class TableSolutionsService {

  dimension = 3; // DOBBIAMO USARE!!! 
  selectedCells = new Map<string, number>();  // USIAMO!! 
  solution: [string, number][] = []; // USIAMO!!! 

  letters = ["A", "B", "C"];
  numbers = [1, 2, 3]
  LETTERS = "QWERTYUIOPASDFGHJKLZCVBNM";

  constructor() {
    // Forse avere funzione che ci dà anche 
    // this.letters = ["A","B","C","D"]
    // this.numbers = [1,2,3,4]
    this.solution = [["A", 1], ["B", 2], ["C", 3]];  // USIAMO!! 
  }


  pickUnique(charset: string, quantity: number) {
      const copy = [...charset];
      const r = [];
      while (quantity--) {
          const rnd = this.getRandom(copy);
          r.push(copy.splice(rnd, 1)[0]);
      }
      return r;
  }

  getRandom(array: string[]): number {
      return Math.floor(Math.random() * array.length);
  }

  createLetterArrays(letters: string[]) {
    const result = [];
    const maxLength = letters.length;
  
    for (const letter of letters) {
      const letterArray = [];
      for (let i = 1; i <= maxLength; i++) {
        letterArray.push([letter, i, i === letters.indexOf(letter) + 1]);
      }
      result.push(letterArray);
    }
  
    return result;
  }

  createMapOfLettersNumbers() {
    let arrayOfLetters = this.pickUnique(this.LETTERS, this.dimension);
    console.log("chosen letters: " + arrayOfLetters)
    let result = this.createLetterArrays(arrayOfLetters);

    console.log("MAP OF LETTERS CREATED:")
    console.log(result)

    return result;
  }

  findTrueValues(array: any[]): any[] {
    const result = [];
  
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (array[i][j][2]) {
          result.push([array[i][j][0], array[i][j][1]]);
          break; // Assuming only one true value per sub-array
        }
      }
    }
  
    return result;
  }


  setSolution(solution: any[]) {
    this.solution = solution;
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
      if (val == input[1]) {
        return true
      }
    }

    for (let key of keysIterator) {
      if (key == input[0]) {
        return true
      }
    }

    return false;
  }


  pushSelectedCell(input: [string, number]) {
    this.selectedCells.set(input[0], input[1]);
    console.log("selectedCells:");
    console.log(this.selectedCells);
  }


  removeSelectedCell(elementToRemove: [string, number]) {

    let isTheLetterAlreadyThere = this.selectedCells.has(elementToRemove[0])
    if (isTheLetterAlreadyThere) {
      let coordinateNumber = this.selectedCells.get(elementToRemove[0]);
      if (coordinateNumber == elementToRemove[1]) {
        this.selectedCells.delete(elementToRemove[0]);
      }
    }

    console.log("selectedCells:");
    console.log(this.selectedCells);
  }


  checkIfIsSolution(): boolean {
    for (let cell of this.solution) {
      if (this.selectedCells.has(cell[0]) && (this.selectedCells.get(cell[0]) == cell[1])) {

      } else {
        return false;
      }
    }

    return true;
  }

  resetSelectedCells() {
    this.selectedCells = new Map<string, number>(); 
  }

}