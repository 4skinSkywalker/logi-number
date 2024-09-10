import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsManipulationService {

  constructor() {
  }

  /***************************
   * 
   * 
   * 
   * 
  *
  *  INITIALIZATION HERE
  *
  * 
  * 
  * 
  ***************************/

  generateHashMapCoordinates(letters: string[], numbers: number[]) {
    // assuming we have   
    //
    // letters = ["A", "B", "C"];
    // numbers = [1, 2, 3]
    // 
    // returns
    // {"A.1": "white", "A.2": "white", "A.3": "white",
    //  "B.1": "white", "B.2": "white", "B.3": "white",           
    //  "C.1": "white", "C.2": "white", "C.3": "white"}             // The values then can be also "green" or "red"
    let resultHashMap = new Map<string, string>();

    for (let letter of letters) {
      for (let number of numbers) {
        let key = letter + "." + number;
        resultHashMap.set(key, "white");
      }
    }

    return resultHashMap;
  }

  getRandom(array: string[]): number {
    // returns a random number between 0 and the length of array 
    // MAYBE ERROR: warning Math.random() should never return 1! Otherwise we are going to select the n-th element of the array
    return Math.floor(Math.random() * array.length);
  }

  pickUnique(charset: string, quantity: number): string[] {
    // given 
    // charset = "QWERTYUIOPASDFGHJKLZCVBNM" 
    // quantity = 10
    // returns 10 random letters from LETTERS ---> ["B", "D", "E", ..., "M"]

    const copy = [...charset];
    const r = [];
    while (quantity--) {
      const rnd = this.getRandom(copy);
      r.push(copy.splice(rnd, 1)[0]);
    }
    return r;
  }



  /***************************
 * 
 * 
 * 
 * 
*
*  IN THE GAME. WHEN CLICKING
*
* 
* 
* 
***************************/

  changeColorValue(hashMap: Map<string, string>, letter: string, nr: number, value: string) {
    // given the hashMap, 
    // it gets the value corresponding to the key: letter.number ---> sets new value 
    hashMap.set(letter + "." + nr, value);
  }



  isThereAlreadyGreenInTheCross(hashMap: Map<string, string>, letters: string[], numbers: number[], coordinatesXY: string): boolean {
    // coordinatesXY: "A.1"
    // hashMap:
    // {"A.1": "white", "A.2": "green", "A.3": "white",
    //  "B.1": "green", "B.2": "white", "B.3": "red",           
    //  "C.1": "white", "C.2": "green", "C.3": "white"}  
    // letters --> ["A","B","C"]
    // numbers --> [1,2,3]
    // says if in the row 1 or column A there already is a Green value
    let [letter, number] = coordinatesXY.split(".")

    // ROW check
    for (let i = 1; i <= numbers.length; i++) {
      if (hashMap.get(letter + "." + i) == "green") {
        return true;
      }
    }

    // COLUMN check
    for (let symbolLetter of letters) {
      if (hashMap.get(symbolLetter + "." + number) == "green") {
        return true;
      }
    }

    return false;
  }


  /***************************
   * 
   * 
   * 
  *
  *  SOLUTION CHECKING HERE
  *
  * 
  * 
  * 
  ***************************/

  determineAllGreenInMap(hashMap: Map<string, string>): string[] {
    // given the hashmap
    // {"A.1": "white", "A.2": "green", "A.3": "white",
    //  "B.1": "green", "B.2": "white", "B.3": "red",           
    //  "C.1": "white", "C.2": "green", "C.3": "white"}  
    // returns the coordinates where we have green, i.e.
    // ["A.2", "C.2", "B.1"]
    let result = [];

    for (let key of hashMap.keys()) {
      if (hashMap.get(key) == "green") {
        result.push(key);
      }
    }

    return result;
  }

  determineIfSolutionSolve(hashMap: Map<string, string>, solution: string[]): boolean {
    // given the hashmap
    // {"A.1": "white", "A.2": "green", "A.3": "white",
    //  "B.1": "white", "B.2": "white", "B.3": "red",           
    //  "C.1": "white", "C.2": "green", "C.3": "white"}  
    // it this is the solution. 
    // where solution = ["A.1", "B.2", "C.3"]
    // i.e., it sees if for every entry in solution the corresponding value in hashMap is green and there are no other greens!
    let allGreens = this.determineAllGreenInMap(hashMap);

    // ordering solution and allGreen
    solution.sort();
    allGreens.sort();

    // seeing if they have same length
    if (solution.length != allGreens.length) {
      return false
    }

    // seeing if each entry in solution corresponds to entry in allGreen
    for (let i = 0; i < solution.length; i++) {
      if (solution[i] != allGreens[i]) {
        return false;
      }
    }

    // otherwise 
    return true;
  }

}
