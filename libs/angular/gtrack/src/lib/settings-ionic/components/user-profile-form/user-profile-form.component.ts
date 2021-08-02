import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserProfileFormComponent as BaseComponent } from '@bit/garlictech.angular.gtrack.customer';

@Component({
  selector: 'gtrack-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileFormComponent extends BaseComponent {}
