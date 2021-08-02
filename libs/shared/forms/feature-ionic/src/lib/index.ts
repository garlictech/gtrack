import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedFormsFeatureModule as NativeSharedFormsFeatureModule } from '@gtrack/shared/forms/feature';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TagInputModule } from 'ngx-chips';
import { NgxMdModule } from 'ngx-md';
import { ChipsComponent } from './chips';
import { DatePickerComponent } from './date-picker';
import { DropdownSelectComponent } from './dropdown-select';
/* import { DynamicFormComponent } from './dynamic-form-component';
 import { DynamicFormFieldComponent } from './dynamic-form-field-component';
import { DynamicFormGroupComponent } from './dynamic-form-group-component';
import { DynamicFormSectionComponent } from './dynamic-form-section-component'; */
import { EmojiInputComponent } from './emoji-input';
import { FileComponent } from './file';
import { MarkdownComponent } from './markdown';
import { MultiSelectComponent } from './multi-select';
import { RadioSelectComponent } from './radio-select';
import { RangeSliderComponent } from './range-slider';
import { RichTextEditorComponent } from './rich-text-editor';
import { SliderComponent } from './slider';
import { SwitchComponent } from './switch';
import { TimePickerComponent } from './time-picker';

@NgModule({
  imports: [
    // ComponentsModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    NativeSharedFormsFeatureModule,
    NgxMdModule,
    ReactiveFormsModule,
    TagInputModule,
    TranslateModule,
  ],
  declarations: [
    ChipsComponent,
    DatePickerComponent,
    DropdownSelectComponent,
    /*   DynamicFormComponent,
      DynamicFormFieldComponent,
      DynamicFormGroupComponent,
      DynamicFormSectionComponent, */
    EmojiInputComponent,
    FileComponent,
    MarkdownComponent,
    MultiSelectComponent,
    RadioSelectComponent,
    RangeSliderComponent,
    RichTextEditorComponent,
    SliderComponent,
    SwitchComponent,
    TimePickerComponent,
  ],
/*   exports: [DynamicFormComponent],
 */})
export class SharedFormsFeatureModule { }

export * from '@gtrack/shared/forms/feature';
