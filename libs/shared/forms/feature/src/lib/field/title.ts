export enum ETitleType {
  main = 'mainTitle',
  section = 'sectionTitle',
}

export interface TitleOptions {
  translatableLabel: string;
  controlType: ETitleType;
}

export class Title implements TitleOptions {
  translatableLabel: string;
  controlType: ETitleType;

  constructor(options: TitleOptions) {
    this.translatableLabel = options.translatableLabel;
    this.controlType = options.controlType;
  }
}
