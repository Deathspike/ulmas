import * as app from '.';
import * as api from 'api';

export interface IController {
  currentPlayer: app.PlayerViewModel | undefined;
  playAsync(series: api.models.Series): Promise<void>;
}
