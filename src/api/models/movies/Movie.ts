import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as mod from '..';
import * as swg from '@nestjs/swagger';

export class Movie {
  constructor(source?: Movie) {
    this.id = source?.id ?? '';
    this.media = source?.media ?? new mod.Media();
    this.plot = source?.plot;
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
