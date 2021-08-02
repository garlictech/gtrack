import { Injectable } from '@angular/core';
import { GraphqlClientService } from '@bit/garlictech.angular.gtrack.graphql-api';
import { LANGUAGES } from '@bit/garlictech.angular.gtrack.gtrack-interfaces';
import {
  Customer,
  GetCustomer,
  GetCustomerQuery,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const languages = LANGUAGES.map(val => ({
  label: `${val.nativeName}(${val.name})`,
  value: val.code,
}));

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private readonly _service: GraphqlClientService) {}

  getCustomer(): Observable<Customer> {
    return this._service.authenticatedClient
      .query(GetCustomer)
      .pipe(
        map(
          (response: ApolloQueryResult<GetCustomerQuery>) =>
            {
              return response.data.getCustomer;
            } 
        )
      );
  }

  /*updateSettings(
    id: string,
    input: UpdateSettingsInput
  ): Observable<Maybe<Customer>> {
    const args: UpdateSettingsMutationVariables = { id, input };
    return this._service.authenticatedClient
      .mutate(UpdateSettings, args)
      .pipe(map(response => _.get(response, 'data.updateSettings')));
  }

  udpateProfile(id: string, input: UpdateProfileInput): Observable<Maybe<Customer>> {
    const args: UpdateProfileMutationVariables = { id, input };
    return this._service.authenticatedClient
      .mutate(UpdateProfile, args)
      .pipe(map(response => _.get(response, 'data.updateProfile')));
  }*/
}
