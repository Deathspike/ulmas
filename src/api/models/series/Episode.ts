import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as mod from '..';
import * as swg from '@nestjs/swagger';

export class Episode {
  constructor(source?: Episode) {
    this.id = source?.id ?? '';
    this.media = source?.media ?? new mod.Media();
    this.episode = source?.episode ?? NaN;
    this.plot = source?.plot;
    this.season = source?.season ?? NaN;
    this.title = source?.title ?? '';
  }
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly id: string;

  @clv.IsObject()
  @clt.Type(() => mod.Media)
  @swg.ApiProperty({type: [mod.Media]})
  readonly media: mod.Media;

  @clv.IsNumber()
  @clv.Min(1)
  @swg.ApiProperty()
  readonly episode: number;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiPropertyOptional()
  readonly plot?: string;

  @clv.IsNumber()
  @clv.Min(0)
  @swg.ApiProperty()
  readonly season: number;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly title: string;
}
