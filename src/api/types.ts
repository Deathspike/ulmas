import * as api from '.';

/**
 * Represents a movie or series entry.
 */
export type Entry = api.models.MovieEntry | api.models.SeriesEntry;

/**
 * Represents the filter types.
 */
export type FilterType = 'all' | 'finished' | 'ongoing' | 'unseen';

/**
 * Represents the sort types.
 */
export type SortType = 'dateAdded' | 'lastPlayed' | 'premieredDate' | 'title';
