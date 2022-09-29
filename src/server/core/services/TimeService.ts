import * as nst from '@nestjs/common';
import {DateTime} from 'luxon';
import fs from 'fs';
const epochTime = DateTime.fromSQL('1970-01-01');

@nst.Injectable()
export class TimeService {
  async getAsync(items: AsyncIterable<DateTime | fs.Stats | string>) {
    let bestTime = undefined as DateTime | undefined;
    for await (const item of items) {
      const itemTime = getDateTime(item);
      if (itemTime <= epochTime || (bestTime && bestTime <= itemTime)) continue;
      bestTime = itemTime;
    }
    if (bestTime) {
      return bestTime.toUTC().toISO({suppressMilliseconds: true});
    } else {
      throw new Error();
    }
  }
}

function getDateTime(value: DateTime | fs.Stats | string) {
  if (DateTime.isDateTime(value)) {
    return value;
  } else if (typeof value === 'string') {
    return DateTime.fromISO(value);
  } else {
    return DateTime.fromJSDate(value.birthtime);
  }
}
