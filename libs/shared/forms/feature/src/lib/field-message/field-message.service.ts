import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class FieldMessageService {
  private readonly subjects: Map<string, Subject<unknown>>;

  constructor() {
    this.subjects = new Map<string, Subject<unknown>>();
  }

  sendMessage(tag: string, message: string): void {
    this.getSubject(tag).next({ text: message });
  }

  clearMessages(tag: string): void {
    this.getSubject(tag).next();
    this.subjects.delete(tag);
  }

  getMessage(tag: string): Observable<unknown> {
    return this.getSubject(tag).asObservable();
  }

  private getSubject(tag: string): Subject<unknown> {
    if (this.subjects.has(tag)) {
      return this.subjects.get(tag) as Subject<unknown>;
    }

    const subject = new Subject<unknown>();
    this.subjects.set(tag, subject);

    return subject;
  }
}
