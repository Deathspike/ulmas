import * as app from '../..';
import * as nst from '@nestjs/common';
import {DateTime} from 'luxon';
const epochTime = DateTime.fromSQL('1970-01-01');

@nst.Injectable()
export class TimeService {
  async getAsync(value: app.Linq<DateTime>) {
    let result = undefined as DateTime | undefined;
    for await (const current of value) {
      if (current <= epochTime) continue;
      if (result && result <= current) continue;
      result = current;
    }
    if (result) {
      return result.toUTC().toISO({suppressMilliseconds: true});
    } else {
      throw new Error();
    }
  }
}
