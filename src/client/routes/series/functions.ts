import {language} from './language';

export function getSeasonPoster(season: number) {
  if (!season) return 'season-specials-poster';
  const id = String(season).padStart(2, '0');
  return `season${id}-poster`;
}

export function getSeasonTitle(season: number) {
  if (!season) return language.specials;
  const id = String(season).padStart(2, '0');
  return `${language.season} ${id}`;
}
