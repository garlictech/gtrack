// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Observer } from 'rxjs/Observer';

// @Injectable()
// export class XhrFileUpload {
//   isSuccess(status): boolean {
//     return status >= 200 && status < 400;
//   }

//   upload(url: string, formData: FormData, progressHandler?: Function) {
//     return new Observable<string>((obs: Observer<string>) => {
//       let xhr: XMLHttpRequest = new XMLHttpRequest();
//       xhr.open('POST', url, true);
//       xhr.onreadystatechange = e => {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//           if (this.isSuccess(xhr.status)) {
//             // Sadness ahead, FormData typings support is less than stellar, so cast to any
//             let uploadedFileName = url + (formData as any).get('key');
//             obs.next(uploadedFileName);
//             obs.complete();
//           } else {
//             obs.error(xhr.statusText);
//             obs.complete();
//           }
//         }
//       };
//       xhr.upload.onprogress = e => {
//         if (progressHandler) {
//           const progress = Math.ceil((e.loaded / e.total) * 100);
//           progressHandler(progress);
//         }
//       };
//       xhr.send(formData);
//     });
//   }
// }
