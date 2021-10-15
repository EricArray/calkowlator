import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartData, LineController, registerables } from 'chart.js';
import { max, number } from 'mathjs';
import { ChargeResult } from '../models/charge-result';
import { fromZeroTo } from '../util';

@Component({
  selector: 'app-charge-output',
  templateUrl: './charge-output.component.html',
  styleUrls: ['./charge-output.component.css']
})
export class ChargeOutputComponent implements AfterViewInit, OnChanges {
  @ViewChild('woundsChart') woundsChartComponent?: ElementRef<HTMLCanvasElement>

  @Input() results: ChargeResult[] = [];

  woundsChart?: Chart

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.results) {
      this.updateWoundsChart()
    }
  }

  ngAfterViewInit(): void {
    Chart.register(...registerables as any);

    this.setupWoundsChart()
  }

  private setupWoundsChart(): void {
    if (this.woundsChartComponent) {
      var ctx = this.woundsChartComponent.nativeElement.getContext('2d');
      
      this.woundsChart = new Chart(ctx!, {
        type: 'line',
        data: this.buildWoundsData(),
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Wounds'
            }
          }
        },
      });
    }
  }

  private updateWoundsChart(): void {
    if (this.woundsChart) {
      this.woundsChart.data = this.buildWoundsData()
      this.woundsChart.update()
    }
  }

  private buildWoundsData(): ChartData {
    const COLORS = ['red', 'green', 'blue']
    const topWounds = max(
      ...this.results.map(chargeResult => max(...chargeResult.woundsTable.keys()))
    )
    const labels = fromZeroTo(topWounds)

    const datasets = this.results.map((chargeResult, index) => ({
      label: 'Charge #' + index,
      borderColor: COLORS[index],
      data: labels.map(label => chargeResult.woundsTable.get(label)
        ? number(chargeResult.woundsTable.get(label)) as number
        : null)
    }))

    return {
      labels,
      datasets,
    }
  }

}
