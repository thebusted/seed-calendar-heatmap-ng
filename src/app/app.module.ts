import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { CalendarHeatmap } from 'angular2-calendar-heatmap';

@NgModule({
  declarations: [
    AppComponent,
    CalendarHeatmap
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
