export enum TextualDescriptionType {
  markdown = 'markdown',
  html = 'html',
}

export interface TextualDescription {
  languageKey: string;
  title?: string | null;
  summary?: string | null;
  fullDescription?: string | null;
  type: TextualDescriptionType;
}
