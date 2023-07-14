import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartEvent, ChartType} from 'chart.js';
import {PhoneService} from '../../service/phone/phone.service';
import {RecycleState} from '../../../../../../../libs/shared_models/enum/recycleState';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'recykle-mono-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input() legendOrientation: 'left' | 'right' | 'top' | 'bottom' = 'left';
  @Input() data: any;
  @Input() title!: string;
  // Pie
  @Input() public type: ChartType = 'pie';

  public pieChartOptions: ChartConfiguration['options'];

  public pieChartPlugins = [ DatalabelsPlugin ];;

  ngOnInit() {
    this.pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: this.legendOrientation,
        },
        labels: ['1', '2'],
        datalabels: {
          color: 'white',
          formatter: (value, ctx) => {
            if (ctx.chart.data.labels) {
              // ${ctx.chart.data.labels[ctx.dataIndex]} -
              return `${ctx.chart.data.datasets[0].data[ctx.dataIndex]}`;
            } else {
              return '';
            }
          },
        },
      }
    } as any;
  }

  // events
  public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    // console.log(event, active);
  }


  toggleLegend(): void {
    if (this.pieChartOptions?.plugins?.legend) {
      this.pieChartOptions.plugins.legend.display = !this.pieChartOptions.plugins.legend.display;
    }

    this.chart?.render();
  }
}
