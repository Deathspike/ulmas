import * as api from '../..';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class Episode {
  constructor(source?: Episode, sourcePatch?: Partial<Episode>) {
    this.sectionId = api.property('sectionId', source, sourcePatch, '');
    this.seriesId = api.property('seriesId', source, sourcePatch, '');
    this.episodeId = api.property('episodeId', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly sectionId: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly seriesId: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @swg.ApiProperty()
  readonly episodeId: string;
}
