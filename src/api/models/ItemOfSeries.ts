import * as api from '..';
import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as mod from '.';
import * as swg from '@nestjs/swagger';

export class ItemOfSeries {
  constructor(source?: ItemOfSeries, sourcePatch?: Partial<ItemOfSeries>) {
    this.id = api.property('id', source, sourcePatch, '');
    this.path = api.property('path', source, sourcePatch, '');
    this.media = api.property('media', source, sourcePatch, []);
    this.plot = api.property('plot', source, sourcePatch, undefined);
    this.title = api.property('title', source, sourcePatch, '');
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly path: string;

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => mod.Media)
  @swg.ApiProperty({type: [mod.Media]})
  readonly media: Array<mod.Media>;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiPropertyOptional()
  readonly plot?: string;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly title: string;
}
