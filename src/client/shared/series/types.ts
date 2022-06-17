import * as app from '.';
import * as api from 'api';

export interface IController {
  currentPlayer?: app.PlayerViewModel;
  viewState?: any;
  playAsync(series: api.models.Series): Promise<void>;
}
