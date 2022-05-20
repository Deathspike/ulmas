import * as clv from 'class-validator';

export class Source {
  constructor(source?: Source) {
    this.id = source?.id ?? '';
    this.mtime = source?.mtime ?? NaN;
    this.path = source?.path ?? '';
    this.type = source?.type ?? '';
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly id: string;

  @clv.IsNumber()
  @clv.Min(0)
  readonly mtime: number;

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly path: string;

  @clv.IsString()
  @clv.IsIn(['image', 'subtitle', 'video'])
  readonly type: string;
}
