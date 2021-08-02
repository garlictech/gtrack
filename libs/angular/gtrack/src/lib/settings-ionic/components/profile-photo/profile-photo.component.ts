import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProfilePhotoComponent as BaseComponent } from '@bit/garlictech.angular.gtrack.customer';
import { faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'gtrack-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePhotoComponent extends BaseComponent {
  icon: IconDefinition;

  constructor() {
    super();
    this.icon = faUser;
  }
}
