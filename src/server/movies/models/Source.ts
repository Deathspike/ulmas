import * as clv from 'class-validator';

export class Source {
  constructor(source?: Source) {
    this.id = source?.id ?? '';
    this.path = source?.path ?? '';
    this.type = source?.type ?? '';
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly path: string;

  @clv.IsString()
  @clv.IsIn(['image', 'subtitle', 'video'])
  readonly type: string;
}
