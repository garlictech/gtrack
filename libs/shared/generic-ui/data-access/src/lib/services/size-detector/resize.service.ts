import { Injectable } from '@angular/core';
import { SCREEN_SIZE } from './size-detector.types';
import { Platform } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ResizeService {
  constructor(private readonly platform: Platform) {}

  currentWidth(): SCREEN_SIZE {
    const width = this.platform.width();

    if (width < 576) {
      return SCREEN_SIZE.sm;
    } else if (width < 768) {
      return SCREEN_SIZE.md;
    } else if (width < 992) {
      return SCREEN_SIZE.lg;
    } else {
      return SCREEN_SIZE.xl;
    }
  }

  isMinMdScreen(): boolean {
    return this.platform.width() >= 768;
  }

  isMinLgScreen(): boolean {
    return this.platform.width() >= 992;
  }

  isMinXlScreen(): boolean {
    return this.platform.width() >= 1200;
  }
}
