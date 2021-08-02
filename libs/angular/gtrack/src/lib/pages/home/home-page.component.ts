import { Component, OnInit } from '@angular/core';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { HikeService } from '@bit/garlictech.angular.gtrack.hike-details';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { shareReplay, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SearchFilterActions } from '@bit/garlictech.angular.gtrack.search';

@Component({
  selector: 'gtrack-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  showcaseHikes$: Observable<CalculatedHike[]>;
  isWorking = true;

  constructor(
    private readonly hikeService: HikeService,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.showcaseHikes$ = this.hikeService.searchShowcaseHikes().pipe(
      tap(() => (this.isWorking = false)),
      take(1),
      shareReplay(1)
    );
  }

  redirectToSearch(position: Position): void {
    this.store.dispatch(
      SearchFilterActions.ChangeFilters({
        center: { lat: position[1], lon: position[0] },
      })
    );
    this.router.navigate(['search']);
  }

  trackByFn(index: number): number {
    return index;
  }
}
