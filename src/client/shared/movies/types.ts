import * as app from '.';
import * as api from 'api';

export interface IController {
  currentPlayer?: app.PlayerViewModel;
  viewState?: any;
  playAsync(movie: api.models.Movie): Promise<void>;
}
