import { Pipe, PipeTransform } from '@angular/core';

const difficulties = {
  1: 'easy',
  2: 'normal',
  3: 'hard',
};

@Pipe({
  name: 'difficulty',
})
export class DifficultyPipe implements PipeTransform {
  transform(value: number): string {
    return difficulties[value] || '';
  }
}
