import { AfterViewInit, Component, Input } from '@angular/core';
// import * as $ from 'jquery';
// require('emojionearea'); // eslint:disable-line:no-var-requires

import { AbstractValueAccessor } from '../abstract-value-accessor/abstract-value-accessor';

@Component({
  selector: 'app-form-emoji-input',
  template: '',
})
export class EmojiInputComponent
  extends AbstractValueAccessor
  implements AfterViewInit {
  @Input() rows: any;
  @Input() placeholder?: string;
  // @ViewChild('emojiArea') emojiArea;

  // private _area;

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    // this._area = (<any>$(this.emojiArea.nativeElement)).emojioneArea({
    //   autocomplete: false,
    //   hidePickerOnBlur: true,
    //   pickerPosition: 'bottom',
    //   events: {
    //     mouseup: (editor, event) => {
    //       this._area[0].emojioneArea.hidePicker();
    //     },
    //     change: (editor, event) => {
    //       this.refreshModel();
    //     },
    //     keyup: (editor, event) => {
    //       this.refreshModel();
    //     },
    //     emojibtn_click: (editor, event) => {
    //       this.refreshModel();
    //     }
    //   }
    // });
  }

  // public refreshModel() {
  //   this.value = $(this.emojiArea.nativeElement)
  //     .data('emojioneArea')
  //     .getText();
  // }
}
