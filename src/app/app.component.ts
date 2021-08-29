import {Component, OnInit} from '@angular/core';
import {Idw} from "./idw";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
/**
 * Intepolation Method Used :  IDW (Inverse Distance Weight)
 * distance = (x2-x1) + (y2-y1)
 * weight = 1/d*2
 * compute = sigma (weight * point_value)/ sigma(weight)
 */
export class AppComponent implements OnInit {
  title = 'Navvis Test';
  csvData?: string;

  constructor() {
  }

  async updateTextArea(data: any) {
    this.csvData = data;
    let textLines = this.splitCSVLines(data);
    let updateLines: string[] = [];
    let coordinates = [];
    let splitStyle: string[] = [];

    for (var x = 0; x < textLines.length; x++) {

      if (textLines[x].split('\\s+').length> 1) {
        splitStyle.push('comma');
      }
      if (textLines[x].split(',').length > 1) {
        splitStyle.push('space');
      }

      let values: number[] = textLines[x].split(/[ ,]+/).filter((space) => space.length > 0)
      .map(cell => parseInt(cell));
      for (var y = 0; y < values.length; y++) {
        if (values[y] !== 0) {
          coordinates.push({x: x + 1, y: y + 1, value: values[y]});
        }
      }
    }

    for (var x = 0; x < textLines.length; x++) {

      let values: number[] = textLines[x].split(/[ ,]+/).filter((space) => space.length > 0)
      .map(cell => parseInt(cell));

      for (var y = 0; y < values.length; y++) {
        if (values[y] === 0) {
          let idws: Idw[] = coordinates
          .map(v => new Idw(1 / Math.pow((Math.abs((x + 1) - v.x) + Math.abs((y + 1) - v.y)), 2), v.value));
          const culmulatedWeightAndValue = idws.map(data => data.weight * data.value)
          .reduce((a, b) => a + b);
          const totalWeight = idws.map(val => val.weight).reduce((a, b) => a + b);
          const computedValue = culmulatedWeightAndValue / totalWeight;
          values[y] = Math.round(computedValue * 10) / 10
        }
      }
      const split = splitStyle[x]=== 'comma'? ',' : ' ';
      updateLines.push(values.join(split));
    }
    this.csvData = await updateLines.join('\n');
  }

  ngOnInit(): void {
  }

  splitCSVLines(data: any): string[] {
    return data.split(/\r\n|\n/).filter((e: string) => e.length != 0);
  }


}



