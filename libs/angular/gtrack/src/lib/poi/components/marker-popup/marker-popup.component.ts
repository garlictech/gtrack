import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { HikeStop } from '@bit/garlictech.universal.gtrack.hike-stops';

export class MarkerPopupComponent {
  // eslint:disable-next-line:no-property-initializers
  static componentName = 'MarkerPopupComponent';
  displayDialog: boolean;

  data: {
    poi: Poi;
    stop: HikeStop;
  };

  constructor() {
    this.displayDialog = false;
  }
  get image(): string {
    // const url = '';

    // if (this.data && this.data.poi && this.data.poi.backgroundImages instanceof Array) {
    //   const imageUrls = this.data.poi.backgroundImages;
    //   const firstImage = imageUrls[0];

    //   url = _get(firstImage, 'card.url', '');
    // }

    // return url;
    return '';
  }

  showDialog(): void {
    this.displayDialog = true;
  }
}
