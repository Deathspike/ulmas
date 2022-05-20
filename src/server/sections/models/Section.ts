import * as clv from 'class-validator';

export class Section {
  constructor(source?: Section) {
    this.id = source?.id ?? '';
    this.paths = source?.paths ?? [];
    this.title = source?.title ?? '';
    this.type = source?.type ?? '';
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly id: string;

  @clv.IsArray()
  @clv.IsString({each: true})
  @clv.IsNotEmpty({each: true})
  @clv.ArrayNotEmpty()
  paths: Array<string>;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  title: string;
  
  @clv.IsString()
  @clv.IsIn(['movies', 'series'])
  type: string;
}
