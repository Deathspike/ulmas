import * as api from 'api';
import * as app from '..';
import * as mobx from 'mobx';
import * as ui from 'client/ui';
import {core} from 'client/core';

export class SeasonViewModel {
  constructor(private readonly sectionId: string, private readonly series: api.models.Series, season: number, episodes: Array<app.EpisodeViewModel>) {
    this.episodes = episodes;
    this.season = season;
    this.title = getSeasonTitle(season);
    mobx.makeObservable(this);
  }

  @mobx.computed
  get pages() {
    return ui.createPages(4, this.episodes.slice());
  }

  @mobx.computed
  get posterUrl() {
    return core.image.series(this.sectionId, this.series, getSeasonPoster(this.season), 'poster');
  }

  @mobx.computed
  get unwatchedCount() {
    return this.episodes.filter(x => !x.source.watched).length;
  }
  
  @mobx.observable
  episodes: Array<app.EpisodeViewModel>;

  @mobx.observable
  season: number;

  @mobx.observable
  title: string;
}

function getSeasonPoster(season: number) {
  if (!season) return 'season-specials-poster';
  const id = String(season).padStart(2, '0');
  return `season${id}-poster`;
}

function getSeasonTitle(season: number) {
  if (!season) return app.language.specials;
  const id = String(season).padStart(2, '0');
  return `${app.language.season} ${id}`;
}
