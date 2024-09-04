import { Component } from '@angular/core';
import { TableSolutionsService } from './services/table-solutions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'logi-number';

  tableSolutionsService: TableSolutionsService;

  constructor(tableSolutionsService: TableSolutionsService) {
    this.tableSolutionsService = tableSolutionsService;
  }

  public check(event: any) {
    console.log("check pressed");

    let doWeHaveSolution = this.tableSolutionsService.checkIfIsSolution();

    console.log("do we have solution? " + doWeHaveSolution);

    
  }
  
}
