import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data: any = {};

  constructor() {
    // Set data
    this.data = [{
      'date': '2016-01-01',
      'total': 17164,
      'details': [{
        'name': 'Project 1',
        'date': '2016-01-01',
        'value': 9192
      }, {
        'name': 'Project 2',
        'date': '2016-01-01',
        'value': 6753
      },
      {
        'name': 'Project N',
        'date': '2016-01-01',
        'value': 1219
      }]
    }];

    // CSV parser
  }
}
