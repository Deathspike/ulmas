import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as mod from '..';
import * as swg from '@nestjs/swagger';

export class Series {
  constructor(source?: Series) {
    this.id = source?.id ?? '';
    this.media = source?.media ?? [];
    this.episodes = source?.episodes ?? [];
    this.plot = source?.plot ?? undefined;
    this.title = source?.title ?? '';
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsArray()
  @clv.ValidateNested({each: true})
  @clt.Type(() => mod.Episode)
  @swg.ApiProperty({type: [mod.Episode]})
  readonly episodes: Array<mod.Episode>;

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
