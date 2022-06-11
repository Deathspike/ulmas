import * as app from '.';

export function getSeasonPoster(season: number) {
  if (!season) return 'season-specials-poster';
  const id = String(season).padStart(2, '0');
  return `season${id}-poster`;
}

export function getSeasonTitle(season: number) {
  if (!season) return app.language.specials;
  const id = String(season).padStart(2, '0');
  return `${app.language.season} ${id}`;
}
