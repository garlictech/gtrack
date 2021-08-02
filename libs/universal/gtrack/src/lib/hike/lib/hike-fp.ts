import { Circle, CircleFp } from '@bit/garlictech.universal.gtrack.geometry';
import { CalculatedHike } from './calculated-hike';

export class HikeFp {
  static isHikeEndpointInCircle(circle: Circle, hike: CalculatedHike): boolean {
    return (
      CircleFp.isPointInSmallCircle(circle, hike.route.startPoint) ||
      CircleFp.isPointInSmallCircle(circle, hike.route.endPoint)
    );
  }
}
