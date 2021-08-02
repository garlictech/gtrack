import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractValueAccessor } from './abstract-value-accessor/abstract-value-accessor';
import { ChipsComponent } from './chips/chips.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DropdownSelectComponent } from './dropdown-select/dropdown-select.component';
import { DynamicFormFieldComponent } from './dynamic-form-field/dynamic-form-field.component';
import { DynamicFormGroupComponent } from './dynamic-form-group/dynamic-form-group.component';
import { DynamicFormSectionComponent } from './dynamic-form-section/dynamic-form-section.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { EmojiInputComponent } from './emoji-input/emoji-input.component';
import { FieldControlService } from './field-control/field-control.service';
import { FieldMessageService } from './field-message/field-message.service';
// import { FileUploadS3Component } from './file-upload-s3';
import { FileComponent } from './file/file.component';
import { MarkdownComponent } from './markdown/markdown.component';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { RadioSelectComponent } from './radio-select/radio-select.component';
import { RangeSliderComponent } from './range-slider/range-slider.component';
import { RichTextEditorComponent } from './rich-text-editor/rich-text-editor.component';
import { SliderComponent } from './slider/slider.component';
import { SwitchComponent } from './switch/switch.component';
import { TimePickerComponent } from './time-picker/time-picker.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [
    ChipsComponent,
    DatePickerComponent,
    DropdownSelectComponent,
    DynamicFormComponent,
    DynamicFormFieldComponent,
    DynamicFormGroupComponent,
    DynamicFormSectionComponent,
    EmojiInputComponent,
    FileComponent,
    MarkdownComponent,
    MultiSelectComponent,
    RadioSelectComponent,
    RangeSliderComponent,
    SwitchComponent,
    RichTextEditorComponent,
    SliderComponent,
    TimePickerComponent,
    AbstractValueAccessor,
  ],
  providers: [FieldControlService, FieldMessageService],
  exports: [
    DatePickerComponent,
    MultiSelectComponent,
    RadioSelectComponent,
    DropdownSelectComponent,
    DynamicFormComponent,
    DynamicFormFieldComponent,
    DynamicFormGroupComponent,
    DynamicFormSectionComponent,
    SwitchComponent,
    MarkdownComponent,
  ],
})
export class SharedFormsFeatureModule {}
