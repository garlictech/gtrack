import { NGXLogger } from 'ngx-logger';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { AUTH_CONFIG, AuthConfig } from '../../interfaces';
import * as fromSelectors from '../../+state/selectors';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthHttpService {
  private _urlRoot: string;

  constructor(
    private readonly log: NGXLogger,
    private readonly _http: HttpClient,
    private readonly _store: Store,
    @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
    private readonly authService: AuthService
  ) {
    this.log.info(`API config: ${this.config}`);
    this._urlRoot = `${this.config.apiRoot}`;
  }

  get<T = unknown>(apiSlug: string): Observable<T> {
    return this._callAuthHttp<T>({ method: 'get', apiSlug });
  }

  getWithParams<T = unknown>(
    apiSlug: string,
    params: HttpParams
  ): Observable<T> {
    return this._callAuthHttp<T>({ method: 'get', apiSlug, params });
  }

  delete<T = unknown>(apiSlug: string): Observable<T> {
    return this._callAuthHttp<T>({ method: 'delete', apiSlug });
  }

  post<T = unknown>(apiSlug: string, data?: T): Observable<T> {
    return this._callAuthHttp<T>({ method: 'post', apiSlug, data });
  }

  put<T = unknown>(apiSlug: string, data?: T): Observable<T> {
    return this._callAuthHttp<T>({ method: 'put', apiSlug, data });
  }
  _callAuthHttp<T = unknown>({
    method,
    apiSlug,
    data,
    params,
  }: {
    method: string;
    apiSlug: string;
    data?: unknown;
    params?: HttpParams;
  }): Observable<T> {
    this.log.debug('HTTP call data:', JSON.stringify(data, null, 2));
    const httpCall = (): Observable<T> =>
      this._getAuthorizationHeaders().pipe(
        switchMap(headers => {
          const options = { headers, params };
          const url = `${this._urlRoot}/${apiSlug}`;

          return (['get', 'delete'].indexOf(method) > -1
            ? this._http.request(method, url, options)
            : this._http.request(method, url, {
                body: data,
                ...options,
              })) as Observable<T>;
        })
      );

    return httpCall().pipe(
      tap(response => this.log.debug('Auth http response: ', response)),
      map(response => response),
      take(1),
      catchError(error => {
        this.log.debug('Auth http error: ', error);

        if (error.status === 401) {
          return this._refreshToken().pipe(switchMap(httpCall));
        }

        this.log.debug('Auth http error response: ', error);
        throw _.get(error, 'error.exception') || 'unknown';
      })
    );
  }

  _refreshToken(): Observable<void> {
    return this.authService.refreshSession();
  }

  private _getAuthorizationHeaders(): Observable<HttpHeaders> {
    return this._store.pipe(
      select(fromSelectors.selectToken),
      take(1),
      map(token => {
        const tokenType = 'Bearer';

        return new HttpHeaders(
          token ? { Authorization: `${tokenType} ${token}` } : {}
        );
      })
    );
  }
}
