import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as nst from '@nestjs/common';
import * as rxo from 'rxjs/operators';

export class ValidatorInterceptor<T extends object> implements nst.NestInterceptor {
  private readonly cls: nst.Type<T>;
  private readonly isArray: boolean;

  constructor(cls: Array<nst.Type<T>> | nst.Type<T>) {
    this.cls = Array.isArray(cls) ? cls[0] : cls;
    this.isArray = Array.isArray(cls);
  }

  intercept(_: nst.ExecutionContext, next: nst.CallHandler) {
    return next.handle().pipe(rxo.map(async (result: Array<T> | T) => {
      if (typeof result !== 'object') {
        throw new nst.InternalServerErrorException();
      } else if (this.isArray) {
        const values = Array<T>().concat(result).map(x => this.convert(x));
        await clv.validateOrReject(values);
        return values;
      } else if (Array.isArray(result)) {
        const value = this.convert(result[0]);
        await clv.validateOrReject(value);
        return value;
      } else {
        const value = this.convert(result);
        await clv.validateOrReject(value);
        return value;
      }
    }));
  }

  private convert(value: T): T {
    return value instanceof this.cls
      ? value
      : clt.plainToClass(this.cls, value);
  }
}
