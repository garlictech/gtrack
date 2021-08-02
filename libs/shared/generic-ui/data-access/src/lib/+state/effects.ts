import { Injectable } from '@angular/core';

@Injectable()
export class Effects {
  /*  handleSpinner$ = createEffect(
    () => {
      return this.isLoadingService
        .isLoading$()
        .pipe(
          switchMap(loading =>
            loading
              ? this._ps.displayLoader('MAINSPINNER')
              : this._ps.dismissLoader('MAINSPINNER')
          )
        );
    },
    {
      dispatch: false,
    }
  );

  displayToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.displayToast),
        tap(action =>
          this._ps.displayToast({
            severity: action.severity || EToastSeverity.Success,
            summary: this._translate.instant(action.summary),
            detail: action.detail
              ? this._translate.instant(action.detail)
              : undefined,
          })
        )
      ),
    {
      dispatch: false,
    }
  );
*/
  constructor /* private readonly actions$: Actions,
    @Inject(GENERIC_UI_PLATFORM_SERVICE)
    private readonly _ps: GenericUiPlatformService,
    private readonly _translate: TranslateService,
    private readonly isLoadingService: IsLoadingService
    */() {
    // EMPTY
  }
}
