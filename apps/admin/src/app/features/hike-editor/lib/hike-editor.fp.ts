import { newHikeId } from '../types';
import { HikeData } from '@bit/garlictech.universal.gtrack.graphql-api';

export class HikeEditorFp {
  static isNewHike(hike: HikeData): boolean {
    return HikeEditorFp.isNewHikeId(hike.id);
  }

  static isNewHikeId(id: string): boolean {
    return id === newHikeId;
  }
}
