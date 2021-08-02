import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class MetaService {
  constructor(private readonly _title: Title, private readonly _meta: Meta) {}

  setTitle(title: string): void {
    this._title.setTitle(title);
    this._meta.addTag({
      property: 'og:title',
      content: title,
    });
  }

  setDescription(description: string): void {
    this._meta.addTags([
      {
        property: 'description',
        content: description,
      },
      {
        property: 'og:description',
        content: description,
      },
    ]);
  }
}
