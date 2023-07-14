import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'recykle-mono-qr-dialog',
  templateUrl: './qr-dialog.component.html',
  styleUrls: ['./qr-dialog.component.scss'],
})
export class QrDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
  }

  print() {
    // todo
  }
}
