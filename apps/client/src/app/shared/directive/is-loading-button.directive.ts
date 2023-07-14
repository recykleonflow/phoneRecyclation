import { ComponentRef, Directive, Input, OnChanges, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import {InlineLoaderComponent} from '../components/inline-loader/inline-loader.component';
import {MatButton} from '@angular/material/button';

@Directive({
  selector: `button[mat-button][loading],
  button[mat-raised-button][loading],
  button[mat-icon-button][loading],
  button[mat-fab][loading],
  button[mat-mini-fab][loading],
  button[mat-stroked-button][loading],
  button[mat-flat-button][loading]`,
})
export class IsLoadingButtonDirective implements OnChanges {
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;

  private loader: ComponentRef<InlineLoaderComponent>| null = null;

  get nativeElement(): HTMLElement {
    return this.matButton._elementRef.nativeElement;
  }

  constructor(private matButton: MatButton, private viewContainerRef: ViewContainerRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['loading']?.currentValue) {
      this.nativeElement.classList.add('mat-loading');
      this.matButton.disabled = true;
      this.createSpinner();
    } else if (!changes?.['loading']?.firstChange) {
      this.nativeElement.classList.remove('mat-loading');
      this.matButton.disabled = this.disabled;
      this.destroySpinner();
    }
  }

  private createSpinner() {
    if (!this.loader) {
      this.loader = this.viewContainerRef.createComponent(InlineLoaderComponent);
      this.renderer.appendChild(this.nativeElement, this.loader.instance._elementRef.nativeElement);
    }
  }

  private destroySpinner() {
    if (this.loader) {
      this.loader.destroy();
      this.loader = null;
    }
  }
}
