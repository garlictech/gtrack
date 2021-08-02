import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { HikeStop } from '@bit/garlictech.universal.gtrack.hike-stops';

export class MarkerPopupComponent {
  static componentName = 'MarkerPopupComponent';

  data: {
    poi: Poi;
    stop: HikeStop;
  };

  closePopup: any; // Popup close method

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
}
