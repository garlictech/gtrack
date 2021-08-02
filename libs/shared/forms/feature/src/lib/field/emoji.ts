import { TextareaField, TextareaFieldOptions } from './textarea';

export class EmojiField extends TextareaField {
  controlType: string;
  disabled: boolean;
  onKeyDown?: () => void;

  constructor(options: TextareaFieldOptions) {
    super(options);
    this.controlType = 'emoji';
    this.disabled = !!options.disabled;

    if (options.onKeyDown) {
      this.onKeyDown = options.onKeyDown;
    }
  }
}
