import { createParamDecorator } from '@nestjs/common';
import * as _ from 'lodash';

export const GetAccessToken = createParamDecorator((__, req): string => {
  return _.get(req, 'user.accessToken', '');
});
