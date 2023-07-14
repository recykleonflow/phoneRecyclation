import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'pp-inline-loader',
  templateUrl: './inline-loader.component.html',
  styleUrls: ['./inline-loader.component.scss'],
})
export class InlineLoaderComponent {
  @Input() small: boolean = false;
  @Input() color: string = 'accent';

  _elementRef: ElementRef;

  constructor(elementRef: ElementRef<HTMLElement>) {
    this._elementRef = elementRef;
  }
}
