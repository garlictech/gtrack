import { Component, OnInit } from '@angular/core';
import { SwUpdateService } from '@bit/garlictech.angular.gtrack.pwa-tools';
import { NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'gtrack-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly swUpdate: SwUpdateService,
    private sidebarService: NbSidebarService
  ) {}

  ngOnInit(): void {
    this.swUpdate.start();
  }
  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }
}
