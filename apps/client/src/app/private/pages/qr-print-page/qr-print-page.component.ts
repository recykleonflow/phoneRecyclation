import {Component, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-qr-print-page',
  templateUrl: './qr-print-page.component.html',
  styleUrls: ['./qr-print-page.component.scss']
})
export class QrPrintPage implements OnInit {

  public ual!: string;
  public imei!: string;

  constructor(private router: Router) {

  }

  ngOnInit() {
    this.ual = history.state['ual'] ?? 'data:ual:123:12312093012';
    this.imei =  history.state['imei'] ?? '123';
  }

  public downloadQrCode() {
      const fileNameToDownload = 'image_qrcode';
      const canvas = document.getElementsByTagName('canvas')[0]
    // let canvas = document.getElementById('canvas');
      const context = (canvas as any).getContext('2d');
      context.fillStyle = "black";
      context.font = "bold 16px Arial";
      context.textAlign = 'left';
      context.textBaseline = 'left';
      context.fillText(`IMEI: ${this.imei}`, 0, (canvas.height));
      // context.canvas.height = '300px';

      this.saveImage((canvas as any).toDataURL(), this.imei)
  }

  private saveImage(imagePath: string, imageName: string ){
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link)
    link.setAttribute('download', imageName + '.png');
    link.setAttribute('href', imagePath.replace("image/png", "image/octet-stream"));
    link.click();
  }

  //function call

}
