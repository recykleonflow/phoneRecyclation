import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Column} from 'typeorm';

@Component({
  selector: 'recykle-mono-material-stats',
  templateUrl: './material-stats.component.html',
  styleUrls: ['./material-stats.component.scss'],
})
export class MaterialStatsComponent implements OnChanges {
  materialMapper: {[name: string]: string} = {
    'aluminium': 'Al',
    'plastic': 'Plastic',
    'glass': 'Glass',
    'gold': 'Au',
    'silver': 'Ag',
    'paladium': 'Pd',
    'platinum': 'Pt',
    'copper': 'Cp',
    'lithium': 'Lt'
  }

  @Input() metric: 'value' | 'percentage' = 'percentage';
  @Input() isLoading = false;
  @Input() materials!: {[materialName: string]: number};
  materialArray: {name: string, value: number, percentage: number, fullName: string}[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['materials']) {
      this.setupMaterials();
    }
  }

  private setupMaterials() {
    if (this.materials) {
      const totalWeight = Number(Object.values(this.materials).reduce((acc, actual) => Number(acc) + Number(actual), 0));
      this.materialArray = Object.keys(this.materials).map(material => ({
        name: this.materialMapper[material],
        fullName: material,
        value: this.materials[material],
        percentage: Math.ceil((Number(this.materials[material])) / totalWeight * 100)
      }))
    }
  }
}
