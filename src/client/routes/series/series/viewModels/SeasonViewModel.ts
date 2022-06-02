import * as app from '..';
import * as mobx from 'mobx';
import * as ui from 'client/ui';
import {core} from 'client/core';

export class SeasonViewModel {
  constructor(private readonly mvm: app.MainViewModel, private readonly sectionId: string, season: number, episodes: Array<app.EpisodeViewModel>) {
    this.episodes = episodes;
    this.season = season;
    this.title = getSeasonTitle(season);
    mobx.makeObservable(this);
  }

  @mobx.computed
  get pages() {
    return Array.from(ui.createPages(4, this.episodes));
  }

  @mobx.computed
  get posterUrl() {
    return this.mvm.source
      ? core.image.series(this.sectionId, this.mvm.source, getSeasonPoster(this.season), 'poster')
      : undefined;
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
