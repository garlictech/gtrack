// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// import { ApiService } from '@gtrack/shared/authentication/data-access-api';
// import { environment } from 'environments/environment';
// import { Policy } from './policy';

// @Injectable()
// export class AwsFormdataService {
//   private policy: Policy;

//   constructor(private http: ApiService) {}

//   getPolicy() {
//     if (this.policy) {
//       return of(this.policy);
//     } else {
//       return this.http.post(environment.awsConfig.policyGenerator, {}).map(res => {
//         let result = res.json();
//         let policy = new Policy(result);
//         this.policy = policy;
//         return policy;
//       });
//     }
//   }

//   buildPayload(file: File, userId: string) {
//     return this.getPolicy().switchMap((policy: Policy) => {
//       let formData = new FormData();
//       formData.append('acl', policy.xAmzAcl);
//       formData.append('Content-Type', file.type);
//       formData.append('X-Amz-Date', policy.xAmzDate);
//       formData.append('x-amz-server-side-encryption', policy.xAmzServerSideEncryption);
//       formData.append('x-amz-meta-uuid', policy.xAmzMetaUuid);
//       formData.append('X-Amz-Algorithm', policy.xAmzAlgorithm);
//       formData.append('X-Amz-Credential', policy.xAmzCredential);
//       formData.append('X-Amz-Signature', policy.s3Signature);
//       formData.append('Policy', policy.base64Policy);
//       formData.append('key', `${policy.folder}/${userId}/${policy.fileUuid}/${file.name}`);
//       // File field must come last!
//       formData.append('file', file);

//       return of(formData);
//     });
//   }
// }
