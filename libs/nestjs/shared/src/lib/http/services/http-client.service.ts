import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpClient {
  private axiosInstance: AxiosInstance;

  public constructor() {
    this.axiosInstance = axios.create();
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.get(url, config)).pipe(
      map(response => response.data)
    );
  }

  public post<T = any>(url: string, data: unknown): Observable<T> {
    return from(this.axiosInstance.post(url, data)).pipe(
      map(response => response.data)
    );
  }
}
