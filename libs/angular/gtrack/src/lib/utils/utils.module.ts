import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoordinatePipe } from './pipes/coordinate.pipe';
import { DifficultyPipe } from './pipes/difficulty.pipe';
import { DurationPipe } from './pipes/duration.pipe';

const PIPES = [CoordinatePipe, DifficultyPipe, DurationPipe];

@NgModule({
  imports: [CommonModule],
  declarations: [...PIPES],
  exports: [...PIPES],
})
export class UtilsModule {}
