import { Field, FieldOptions } from './field';

export interface FileUploadOptions extends FieldOptions<File> {
  fileId?: string;
  type?: string;
  placeholder?: string;
}

export class FileUploadField extends Field<File> implements FileUploadOptions {
  controlType: string;
  fileId?: string;
  placeholder?: string;
  type: string;

  constructor(options: FileUploadOptions) {
    super(options);
    this.fileId = options.fileId;
    this.controlType = 'file';
    this.type = 'image/*';

    if (options.placeholder) {
      this.placeholder = options.placeholder;
    }

    if (options.type) {
      this.type = options.type;
    }

    this.validators.push(control =>
      control.value === 'error' ? { uploadError: false } : null
    );
  }
}
