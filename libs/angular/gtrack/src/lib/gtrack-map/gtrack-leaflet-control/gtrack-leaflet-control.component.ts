import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { Map, Control, DomEvent } from 'leaflet';
import {
  faSyncAlt,
  IconDefinition,
  faCogs,
} from '@fortawesome/free-solid-svg-icons';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import {
  faMapMarkerAlt,
  faMapMarkerAltSlash,
  faStamp as faStampRegular,
  faLayerPlus,
  faLayerMinus,
} from '@fortawesome/pro-regular-svg-icons';
import {
  faMapMarkerAlt as faMapMarkerAltSolid,
  faMapMarkerAltSlash as faMapMarkerAltSlashSolid,
  faStamp as faStampSolid,
} from '@fortawesome/pro-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gtrack-leaflet-control',
  templateUrl: './gtrack-leaflet-control.component.html',
  styleUrls: ['../gtrack-map.scss'],
})
export class GtrackLeafletControlComponent {
  @Input() poiControlShown: boolean | null;
  @Output() poiControlChange = new EventEmitter();
  @Output() resetRequested = new EventEmitter();

  poiControlConfig: {
    routeOnTop: boolean;
    onrouteShown: boolean;
    offrouteShown: boolean;
    checkpointsShown: boolean;
  } = {
    routeOnTop: true,
    onrouteShown: false,
    offrouteShown: false,
    checkpointsShown: false,
  };

  syncIcon: IconDefinition = faSyncAlt;
  cogIcon: IconDefinition = faCogs;
  onrouteIcon = faMapMarkerAlt;
  offrouteIcon = faMapMarkerAltSolid;
  onrouteIconOff = faMapMarkerAltSlash;
  offrouteIconOff = faMapMarkerAltSlashSolid;
  checkpointIconOn = faStampSolid;
  checkpointIconOff = faStampRegular;
  routeOnTopIconOn = faLayerPlus;
  routeOnTopIconOff = faLayerMinus;

  public control: Control;

  constructor(private elRef: ElementRef) {}

  @Input() set map(map: Map) {
    const element = this.elRef.nativeElement;
    DomEvent.disableClickPropagation(element);

    if (map) {
      const Custom = Control.extend({
        onAdd() {
          return element;
        },
      });

      this.control = new Custom({
        position: 'bottomright',
      });

      this.control.addTo(map);
    }
  }

  onResetClick(): void {
    this.resetRequested.emit(true);
  }

  toggleOnrouteMarkers(): void {
    this.toggleProperty('onrouteShown');
  }

  toggleRouteOnTop(): void {
    this.toggleProperty('routeOnTop');
  }

  toggleOffrouteMarkers(): void {
    this.toggleProperty('offrouteShown');
  }

  toggleCheckpointMarkers(): void {
    this.toggleProperty('checkpointsShown');
  }

  private toggleProperty(propertyName: string) {
    this.poiControlConfig[propertyName] = !this.poiControlConfig[propertyName];
    this.poiControlChange.emit(this.poiControlConfig);
  }
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [CommonModule, FontAwesomeModule, IonicModule],
  exports: [GtrackLeafletControlComponent],
  declarations: [GtrackLeafletControlComponent],
  providers: [],
})
export class GtrackLeafletControlComponentModule {}
