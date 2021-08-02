import { Pipe, PipeTransform } from '@angular/core';
import { Image } from '@bit/garlictech.universal.gtrack.graphql-api';
import distance from '@turf/distance';
import { point as turfPoint } from '@turf/helpers';

@Pipe({
  name: 'poiImagesWithinCircle',
})
export class PoiImagesWithinCirclePipe implements PipeTransform {
  transform(images: Image[], properties: number[]): Image[] {
    if (!images) {
      return [];
    } else if (properties) {
      // properties: [lat, lon, distance]
      return images.filter((image: Image) => {
        const imageLocation = turfPoint([image.lon, image.lat]);
        const poiLocation = turfPoint([properties[1], properties[0]]);
        const dist = distance(imageLocation, poiLocation) * 1000;

        return dist <= properties[2];
      });
    } else {
      return images;
    }
  }
}
