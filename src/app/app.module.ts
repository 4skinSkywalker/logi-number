import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableCellsComponent } from './components/table-cells/table-cells.component';
import { CellComponent } from './components/cell/cell.component';

@NgModule({
  declarations: [
    AppComponent,
    TableCellsComponent,
    CellComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
