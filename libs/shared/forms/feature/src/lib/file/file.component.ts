import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AbstractValueAccessor } from '../abstract-value-accessor/abstract-value-accessor';
import { UploadOptions } from '../field/file';

@Component({
  selector: 'app-native-form-file',
  template: '',
})
export class FileComponent
  extends AbstractValueAccessor
  implements OnInit, OnDestroy {
  @Input()
  uploadOptions!: UploadOptions;
  @Input() isBasic: any;
  @Input() placeholder: any;
  uploaded$!: Observable<boolean>;
  protected _destroy$;

  constructor() {
    super();
    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    this.uploaded$ = this.uploadOptions.fileId$.pipe(map(uri => !!uri));
    this.uploadOptions.fileId$
      .pipe(takeUntil(this._destroy$))
      .subscribe(id => (this.value = id));
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
