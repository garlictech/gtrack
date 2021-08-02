import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LeafletMarkerPopupService {
  /*onUserMarkerClick: (
    marker: L.Marker,
    popupData: LeafletMarkerPopupData,
    e: L.LeafletMouseEvent
  ) => Observable<L.Popup>;
  private _compRef: ComponentRef<unknown>;
*/
  constructor /*  private readonly _resolver: ComponentFactoryResolver,
    private readonly _appRef: ApplicationRef,
    private readonly _injector: Injector
    */() {
    // eslint:disable:no-string-literal
    /*  this.onUserMarkerClick = (
      _marker: L.Marker,
      popupData: LeafletMarkerPopupData,
      e: L.LeafletMouseEvent
    ): Observable<L.Popup> => {
      const factories = Array.from(this._resolver['_factories'].keys());
      const factoryClass = factories.find(
        (x: { componentName: string }) =>
          x.componentName === popupData.popupComponentName
      ) as Type<any>;

      if (factoryClass) {
        const compFactory = this._resolver.resolveComponentFactory(
          factoryClass
        );
        this._compRef = compFactory.create(this._injector);

        // Pass params to the loaded component
        this._compRef.instance.opened = true;
        this._compRef.instance.data = _cloneDeep(popupData.data);
        this._compRef.instance.closePopup = () => {
          this._compRef.destroy();
          if (popupData.closeCallback) {
            popupData.closeCallback();
          }
        };

        // It's necessary for change detection within MapInfoWindow
        this._appRef['attachView'](this._compRef.hostView);
        this._compRef.onDestroy(() => {
          this._appRef['detachView'](this._compRef.hostView);
        });

        const div: HTMLDivElement = document.createElement('div');
        div.appendChild(this._compRef.location.nativeElement);

        const observable = timer(150).pipe(
          map(() => {
            let width = popupData.width || 205;

            if (!popupData.width && popupData.data.backgroundImages) {
              width = 250;
            }

            const popup = L.popup({
              offset: L.point(0, -30),
              minWidth: width,
              className: popupData.className || '',
            });

            popup
              .setLatLng(e.target.getLatLng())
              .setContent(div)
              .openOn(popupData.map);

            return popup;
          })
        );

        observable.subscribe();

        return observable;
      }
    };
    */
  }
}
