import * as app from '.';
import * as api from 'api';

export interface IController {
  currentPlayer?: app.PlayerViewModel;
  playAsync(movie: api.models.Movie): Promise<void>;
}
