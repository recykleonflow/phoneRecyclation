import { Component } from '@angular/core';
import {InlineLoaderModule} from '../inline-loader/inline-loader.module';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  imports: [
    InlineLoaderModule
  ],
  standalone: true
})
export class LoadingComponent {

}
