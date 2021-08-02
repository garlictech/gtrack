import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DeletionButtonComponent as BaseComponent } from '@bit/garlictech.angular.gtrack.customer';

@Component({
  selector: 'gtrack-profile-deletion-button',
  templateUrl: './profile-deletion.component.html',
  styleUrls: ['./profile-deletion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeletionButtonComponent extends BaseComponent {}
