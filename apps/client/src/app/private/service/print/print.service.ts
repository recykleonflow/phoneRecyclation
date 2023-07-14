import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() {}

  public async print(canvases: HTMLCanvasElement[]) {
    const images = await Promise.all(canvases.map(canvasElement => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = canvasElement.toDataURL();
      });
    }));

      const printable = `
      <html>
        <head>
          <style>
            body { margin: 5px; }
            canvas { display: block; }
          </style>
        </head>
        <body>
          ${images.map(image => `<img style="display: block; padding: 5px" src="${image.src}" style="max-width: 50px;">`).join('')}
        </body>
      </html>
    `;

      // const windowPrint = window.open('', '_blank') as any;
      // const windowPrint = window.open(printable) as any;
      // windowPrint.document.write();
      // windowPrint.document.close();

    const windowPrint = window.open('', '_blank') as any;
    windowPrint.document.open();
    windowPrint.document.write(printable);
    windowPrint.document.close();
    windowPrint.print();
      // windowPrint.print();
  }

  public setImeiToQr(canvas: any, description: string | null) {
    const fileNameToDownload = 'image_qrcode';
    // let canvas = document.getElementById('canvas');
    const context = (canvas as any).getContext('2d');
    context.fillStyle = "black";
    context.font = "bold 14px Arial";
    context.textAlign = 'left';
    context.textBaseline = 'left';
    context.fillText(`IMEI: ${description}`, 0, (canvas.height));
    // context.canvas.height = '300px';
    // this.saveImage((canvas as any).toDataURL(), description || '')
  }

  private saveImage(imagePath: string, imageName: string ){
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link)
    link.setAttribute('download', imageName + '.png');
    link.setAttribute('href', imagePath.replace("image/png", "image/octet-stream"));
    link.click();
  }
}
