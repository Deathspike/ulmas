import * as api from 'api';

export class ViewState {
  constructor(
    readonly search: string,
    readonly source: Array<api.models.SeriesEntry>,
    readonly title: string) {}
}
