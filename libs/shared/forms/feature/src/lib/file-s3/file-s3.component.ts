// import { Component, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
// import { Store } from '@ngrx/store';

// import { environment } from 'environments/environment';

// import { AwsFormdataService } from '../aws-formdata-service/aws-formdata.service';
// import { XhrFileUpload } from '../xhr-file-upload';
// import { AbstractValueAccessor } from '../abstract-value-accessor';

// @Component({
//   selector: 'app-form-file-upload-s3',
//   template: ''
// })
// export class FileUploadS3Component extends AbstractValueAccessor implements OnDestroy {
//   @Input() fileId: string;
//   @Input() type: string;
//   @Input() placeholder: string;
//   @Input() userId: string;
//   public thumbnailUrl: string;
//   private file: File;
//   public uploading: boolean;
//   private uploadSubscription: any;
//   private uploadedFileName;
//   private progress: number;

//   constructor(
//     private _awsFormdataService: AwsFormdataService,
//     private _xhrFileUpload: XhrFileUpload,
//     private _store: Store,
//     private _cdr: ChangeDetectorRef
//   ) {
//     super();
//   }

//   onChangeInternal(event) {
//     this.uploading = true;
//     const files = event.target.files;
//     this.file = files[0];
//     if (this.file) {
//       this.uploadSubscription = this.upload().subscribe(
//         res => {
//           this.onChange(this.uploadedFileName);
//           this.value = this.thumbnailUrl = this.uploadedFileName;
//           this.uploading = false;
//           this._cdr.detectChanges();
//         },
//         err => {
//           this.value = 'error';
//           this.onChange('error');
//           this.uploading = false;
//           this._cdr.detectChanges();
//         }
//       );
//     }
//   }

//   upload() {
//     this.progress = 0;
//     this.uploadedFileName = '';

//     return this._awsFormdataService.buildPayload(this.file, this.userId).switchMap(formData => {
//       this.uploadedFileName = environment.awsConfig.s3 + formData.get('key');
//       return this._xhrFileUpload.upload(environment.awsConfig.s3, formData, progress => {
//         this.progress = progress;
//         this._cdr.detectChanges();
//       });
//     });
//   }

//   generateBackground() {
//     return `linear-gradient(90deg, red 0%, red ${this.progress}%, #fff ${this.progress + 1}%, #fff ${100 -
//       this.progress}%`;
//   }

//   ngOnDestroy(): void {
//     if (this.uploadSubscription) {
//       this.uploadSubscription.unsubscribe();
//     }
//   }
// }
