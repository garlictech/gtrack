import { Component, NgModule, OnInit } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AuthenticationActions } from '@gtrack/shared/authentication/data-access';
import { RouterModule } from '@angular/router';
import { routes } from '@admin/app-routing.module';
import { CommonModule } from '@angular/common';
import { NbMenuModule } from '@nebular/theme';

@Component({
  selector: 'gtrack-app-menu',
  templateUrl: './ui.html',
})
export class MenuComponent implements OnInit {
  items: NbMenuItem[] = [
    {
      title: 'Hikes',
      link: '/admin/hikes',
    },
    {
      title: 'Groups',
      link: '/admin/hike-groups',
    },
    {
      title: 'Icons',
      link: '/icons',
    },
    {
      title: 'Logout',
      data: { id: 'logout' },
    },
  ];
  constructor(
    private readonly _store: Store,
    private nbMenuService: NbMenuService
  ) {}

  ngOnInit() {
    this.nbMenuService.onItemClick().subscribe(event => {
      if (event.item.title === 'Logout') {
        this._store.dispatch(new AuthenticationActions.LogoutStart());
      }
    });
  }
}
@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, NbMenuModule],
  exports: [MenuComponent],
  declarations: [MenuComponent],
})
export class MenuModule {}