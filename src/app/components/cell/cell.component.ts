import { Component, Input, OnInit } from '@angular/core';
import { TableSolutionsService } from '../../services/tableSolution/table-solutions.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})
export class CellComponent {

  @Input() coordinates: string;

  tableSolutionsService: TableSolutionsService;

  constructor(tableSolutionsService: TableSolutionsService) {
    this.tableSolutionsService = tableSolutionsService;
  }

  public ngOnInit(): void {
      // console.log(`coordinates: ${this.coordinates}`)
  }


  public cellClicked(event: any) {
    // 1. check is already green in cross 
    let isThereAlreadyGreenInCross = this.tableSolutionsService.isThereAlreadyGreenInCross(this.coordinates)
    
    // 2. just change the hashMapOfStates 
    let actualColor = this.tableSolutionsService.mapCoordinates.get(this.coordinates);

    if(actualColor == "white" && isThereAlreadyGreenInCross) {
      this.tableSolutionsService.mapCoordinates.set(this.coordinates, "red")
    } else if (actualColor == "white" && !isThereAlreadyGreenInCross) {
      this.tableSolutionsService.mapCoordinates.set(this.coordinates, "green")
    } else if (actualColor == "red") {
      this.tableSolutionsService.mapCoordinates.set(this.coordinates, "white")
    } else if (actualColor == "green") {
      this.tableSolutionsService.mapCoordinates.set(this.coordinates, "red")
    }
  }



}
