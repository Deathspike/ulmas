import * as nst from '@nestjs/common';
import {ValidatorInterceptor} from './ValidatorInterceptor';

export function Validator<T extends object>(types: Array<nst.Type<T>> | nst.Type<T>) {
  return nst.UseInterceptors(new ValidatorInterceptor(types));
}
