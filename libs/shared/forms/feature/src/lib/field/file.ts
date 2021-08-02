import { Observable } from 'rxjs';
import { Field, FieldOptions } from './field';

export interface UploadOptions {
  uploading$: Observable<boolean>;
  fileId$: Observable<string>;
  uploadHandler(event: unknown): void;
}

export interface FileOptions extends FieldOptions<File> {
  uploadOptions: UploadOptions;
  isBasic?: boolean;
  fileId?: string;
  mimeType?: string;
}

export class FileField extends Field<File> implements FileOptions {
  fileId?: string;
  mimeType: string;
  isBasic: boolean;
  uploadOptions: UploadOptions;

  constructor(options: FileOptions) {
    super(options);
    this.controlType = 'file';
    this.fileId = options.fileId;
    this.mimeType = options.mimeType || 'image/*';
    this.isBasic = options.isBasic || false;
    this.uploadOptions = { ...options.uploadOptions };

    this.validators.push(control =>
      control.value === 'error' ? { uploadError: false } : null
    );
  }
}
