import { Injectable } from '@angular/core';
// import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { Subscription } from 'rxjs';

// const degtorad = Math.PI / 180; // Degree-to-Radian conversion
// const getCompassHeading = (alpha, beta, gamma) => {
//   const _x = beta ? beta * degtorad : 0; // beta value
//   const _y = gamma ? gamma * degtorad : 0; // gamma value
//   const _z = alpha ? alpha * degtorad : 0; // alpha value

//   // const cX = Math.cos(_x);
//   const cY = Math.cos(_y);
//   const cZ = Math.cos(_z);
//   const sX = Math.sin(_x);
//   const sY = Math.sin(_y);
//   const sZ = Math.sin(_z);

//   // Calculate Vx and Vy components
//   const Vx = -cZ * sY - sZ * sX * cY;
//   const Vy = -sZ * sY + cZ * sX * cY;

//   // Calculate compass heading
//   let compassHeading = Math.atan(Vx / Vy);

//   // Convert compass heading to use whole unit circle
//   if (Vy < 0) {
//     compassHeading += Math.PI;
//   } else if (Vx < 0) {
//     compassHeading += 2 * Math.PI;
//   }

//   return compassHeading * (180 / Math.PI); // Compass Heading (in degrees)
// };

@Injectable()
export class DeviceOrientationService {
  // private _lastHeading: number;
  private _orientationSubscription$: Subscription;

  // constructor(
  //   // private readonly _store: Store,
  //   // private readonly _deviceOrientation: DeviceOrientation,
  //   // private readonly _platform: Platform
  // ) {}

  askForCalibrate(): void {
    window.addEventListener(
      'compassneedscalibration',
      event => {
        // ask user to wave device in a figure-eight motion
        event.preventDefault();
      },
      true
    );
  }

  startWatch(): void {
    // const isCordovaApp = this._platform.is('cordova') && (this._platform.is('ios') || this._platform.is('android'));

    if (this._orientationSubscription$) {
      this.clearWatch();
    }

    // if (isCordovaApp) {
    //   this._orientationSubscription$ = this._deviceOrientation
    //     .watchHeading()
    //     .pipe(throttle(val => interval(1000)))
    //     .subscribe(
    //       (orientation: DeviceOrientationCompassHeading) => {
    //         console.error('orientation', JSON.stringify(orientation));

    //         this._store.dispatch(
    //           new deviceActions.SetHeading({
    //             magneticHeading: orientation.magneticHeading,
    //             trueHeading: orientation.trueHeading,
    //             headingAccuracy: orientation.headingAccuracy,
    //           })
    //         );
    //       },
    //       err => {
    //         this._store.dispatch(new deviceActions.SetHeading({}));
    //       }
    //     );
    // } else {
    //   this._orientationSubscription$ = fromEvent(window, 'deviceorientation')
    //     .pipe(throttle(val => interval(1000)))
    //     .subscribe((event: DeviceOrientationEvent) => {
    //       const heading = Math.round(
    //         (event as any).webkitCompassHeading || getCompassHeading(event.alpha, event.beta, event.gamma)
    //       );

    //       if (!_isEqual(heading, this._lastHeading)) {
    //         this._lastHeading = heading;
    //         this._store.dispatch(
    //           new deviceActions.SetHeading({
    //             magneticHeading: heading,
    //           })
    //         );
    //       }
    //     });
    // }
  }

  clearWatch(): void {
    this._orientationSubscription$.unsubscribe();
  }
}
