import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as GeneralInfoFeature from './general-info.reducer';
import * as GeneralInfoActions from './general-info.actions';

@Injectable()
export class GeneralInfoEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GeneralInfoActions.init),
      fetch({
        run: action => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return GeneralInfoActions.loadGeneralInfoSuccess({ generalInfo: [] });
        },

        onError: (action, error) => {
          console.error('Error', error);
          return GeneralInfoActions.loadGeneralInfoFailure({ error });
        },
      })
    )
  );

  constructor(private actions$: Actions) {}
}
