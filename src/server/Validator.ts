import * as app from '.';
import * as nst from '@nestjs/common';

export function Validator<T extends object>(types: Array<nst.Type<T>> | nst.Type<T>) {
  return nst.UseInterceptors(new app.ValidatorInterceptor(types));
}
