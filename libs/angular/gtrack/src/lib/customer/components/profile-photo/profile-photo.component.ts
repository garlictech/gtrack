import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { EAuthRoles } from '@gtrack/shared/authentication/data-access';
import { Observable } from 'rxjs';

@Component({
  selector: 'gtrack-common-profile-photo',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePhotoComponent implements OnInit {
  @Input() enableIcon: boolean;
  @Input() role$?: Observable<EAuthRoles | null>;
  @Input() userId$?: Observable<string | null>;

  //profile$: Observable<any>;

  constructor() {
    this.enableIcon = false;
  }

  ngOnInit(): void {
    // if (!this.role$) {
    //   this.role$ = of(null);
    // }
    // if (!this.userId$) {
    //   this.userId$ = of(null);
    // }
    // let profile$ = Observable.combineLatest(this.role$, this.userId$).switchMap(result => {
    //   let role = result[0];
    //   let userId = result[1];
    //   return role && userId ? this._selectors.getPublicProfileOf(userId, role) : this._selectors.getMyPublicProfile;
    // });
    // this.profile$ = profile$.filter(profile => !!profile);
  }
}
