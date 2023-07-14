import {Component} from '@angular/core';
import {PhoneService} from '../../service/phone/phone.service';
import {LoadingService} from '../../../loading.service';
import { RoleSelectionService } from '../../service/role-selection/role-selection.service';
import { UserRole } from '../../../../../../../libs/shared_models/enum/user-role';
import {Router} from '@angular/router';
import {ChartData} from 'chart.js';
import {RecycleState} from '../../../../../../../libs/shared_models/enum/recycleState';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    statisticData!: {
        stateStatistics: any, 
        countsByBrands: any, 
        summedMaterials: any
    };
    statisticDataTotalCount!: number;
    public barChartData: ChartData<'bar'> = {
        labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
        datasets: [
            { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
            { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
        ]
    };

    constructor(
        public router: Router,
        public phoneService: PhoneService,
        public loadingService: LoadingService,
        public roleSelectionService: RoleSelectionService
    ) {
        const role = this.roleSelectionService.getRole();
        switch (role) {
            case UserRole.CLIENT: {
                this.router.navigate(['private/my-devices']);
                break;
            }
            case UserRole.RECYCLE_COMPANY: {
                this.router.navigate(['private/requests']);
                break;
            }
            default: {
                const actualData = this.phoneService.statistics;
                if (actualData) {
                    this.statisticData = actualData;
                    this.loadingService.isToolbarLoading = true;
                }
                else {
                    this.loadingService.isLoading = true;
                }
                this.phoneService.getStatistics().subscribe(
                    data => {
                       this.prepareData(data);
                       this.phoneService.setStatistics(this.statisticData);
                    }
                )
            }
        }
    }

    prepareData(data: {stateStatistics: any, countsByBrands: any, summedMaterials: any}) {
        this.loadingService.isLoading = false;
        this.loadingService.isToolbarLoading = false;
        this.statisticData = data;
        this.statisticDataTotalCount = data.stateStatistics.reduce((acc, actual) => {
            return acc + actual.count;
        }, 0)
        this.statisticData.stateStatistics = this.setupPieData(this.statisticData.stateStatistics);
        this.statisticData.countsByBrands = this.setupBarData(this.statisticData.countsByBrands);
        this.statisticData.summedMaterials = this.setupMaterialsBarData(this.statisticData.summedMaterials);
    }

    private setupMaterialsBarData(data: {material: string, sum: number}[]) {
        return {
            labels: data.map(d => d.material),
            datasets: [
                {
                    data: data.map(d => d.sum.toFixed(2)),
                    backgroundColor: ['#82d598'], 
                    label: 'Materials (g)'
                },
            ]
        }
    }

    private setupBarData(data: {brand: string, count: number}[]) {
        return {
            labels: data.map(d => d.brand),
            datasets: [
                {
                    data: data.map(d => d.count),
                    backgroundColor: ['#4a75be'],
                    label: 'Brands'
                },
            ]
        }
    }

    private setupPieData(data: {state: RecycleState, count: number}[]) {
        const {labels, counts} = data.reduce( (acc, actual) => {
            acc.labels.push(actual.state);
            acc.counts.push(actual.count);
            return acc;
        }, {labels: [], counts: []})

        return {
            // labels: [ [ 'Download', 'Sales' ], [ 'In', 'Store', 'Sales' ], 'Mail Sales' ],
            // datasets: [ {
            //   data: [ 300, 500, 100 ]
            // } ]
            labels,
            legend: {
                labels: { fontColor: 'white' }
            },
            datasets: [
                {
                    data: counts,
                    backgroundColor: ['#82d598','#e79441','#4a75be'],
                }
            ]
        };
    }
}