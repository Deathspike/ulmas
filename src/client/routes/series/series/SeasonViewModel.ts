import * as api from 'api';
import * as mobx from 'mobx';
import {language} from './language';

export class SeasonViewModel {
  constructor(season: number, episodes: Array<api.models.Episode>) {
    this.episodes = episodes;
    this.season = season;
    this.title = getSeasonTitle(season);
    mobx.makeObservable(this);
  }

  @mobx.computed
  get pages() {
    return createPages(this.episodes.slice());
  }

  @mobx.computed
  get unwatchedCount() {
    return this.episodes.filter(x => !x.watched).length;
  }
  
  @mobx.observable
  episodes: Array<api.models.Episode>;

  @mobx.observable
  season: number;

  @mobx.observable
  title: string;
}

function createPages(episodes: Array<api.models.Episode>) {
  const result = [];
  while (episodes.length) result.push(episodes.splice(0, 4));
  return result;
}

function getSeasonTitle(season: number) {
  if (!season) return language.specials;
  const id = String(season).padStart(2, '0');
  return `${language.season} ${id}`;
}
