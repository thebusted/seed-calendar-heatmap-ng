import { Component, ElementRef, ViewChild } from '@angular/core';
import { Http, Response, Headers, Request } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// Import external script
import * as d3 from 'd3';
import * as moment from 'moment';
import * as Plottable from 'plottable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data: any = [];
  color: String = '#EA5824';
  overview: String = 'year';

  // Create calendar variables
  daysOfWeek: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(
    private http: Http,
    private elementRef: ElementRef
  ) {
    // Request JSON data
    http.get('./assets/data/sales-per-day.json').subscribe(res => {
      const json = res.json();

      // Iterate to build data from "json"
      json.forEach(key => {
        // const date = moment.utc(key.date).toString();
        const date = new Date(key.date);

        // Data for Calendar Heatmap Mini
        this.data.push({
          date: date,
          count: key.sales
        });
      });

      // Build calendar heatmap
      this.buildCalendarHeatmap();
    });
  }

  private buildCalendarHeatmap() {
    const xScale = new Plottable.Scales.Category();
    const yScale = new Plottable.Scales.Category();
    yScale.domain(this.daysOfWeek);

    const xAxis = new Plottable.Axes.Category(xScale, 'bottom');
    const yAxis = new Plottable.Axes.Category(yScale, 'left');
    xAxis.formatter(this.monthFormatter());

    const colorScale = new Plottable.Scales.InterpolatedColor();
    colorScale.domain([0, 1]);
    colorScale.range(['#eee', '#d6e685', '#8cc665', '#44a340', '#1e6823']);

    const plot = new Plottable.Plots.Rectangle()
      .addDataset(new Plottable.Dataset(this.data))
      .x((d) => [d.date.getFullYear(), this.getWeekOfTheYear(d.date)], xScale)
      .y((d) => this.daysOfWeek[d.date.getDay()], yScale)
      .attr('fill', (d) => d.val, colorScale)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    const plotHighlighter = new Plottable.Plots.Rectangle()
      .addDataset(new Plottable.Dataset(this.data))
      .x((d) => [d.date.getFullYear(), this.getWeekOfTheYear(d.date)], xScale)
      .y((d) => this.daysOfWeek[d.date.getDay()], yScale)
      .attr('fill', 'black')
      .attr('fill-opacity', 0);

    const group = new Plottable.Components.Group([plot, plotHighlighter]);

    const interaction = new Plottable.Interactions.Pointer();
    interaction.onPointerMove((p) => {
      const nearestEntity = plotHighlighter.entityNearest(p);
      const hoveredMonth = nearestEntity.datum.date.getMonth();
      plotHighlighter.entities().forEach((entity) => {
        const date = entity.datum.date;
        entity.selection.attr('fill-opacity', date.getMonth() === hoveredMonth ? 0.5 : 0);
      });
    });
    interaction.onPointerExit(() => {
      plotHighlighter.entities().forEach((entity) => {
        entity.selection.attr('fill-opacity', 0);
      });
    });
    interaction.attachTo(plot);

    const table = new Plottable.Components.Table([
      [yAxis, group],
      [null, xAxis]
    ]);

    table.renderTo('#example');
  }

  private getFirstDisplayableSunday(date): any {
    return new Date(
      date.getFullYear(),
      0,
      1 - new Date(date.getFullYear(), 0, 1).getDay()
    );
  }

  private getWeekOfTheYear(date): number {
    const firstSunday = this.getFirstDisplayableSunday(date);
    const diff = date - firstSunday;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(Math.ceil(diff / oneDay) / 7);
  }

  private monthFormatter() {
    return (yearAndWeek) => {
      const year = yearAndWeek[0];
      const week = yearAndWeek[1];
      const startOfWeek = new Date(year, 0, (week + 1) * 7 - new Date(year, 0, 1).getDay());
      if (startOfWeek.getDate() > 7) {
        return '';
      }
      return this.months[startOfWeek.getMonth()];
    };
  }

}
