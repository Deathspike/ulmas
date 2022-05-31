import * as app from '.';

export const core = {
  api: new app.ApiService(),
  image: new app.ImageService(),
  screen: new app.ScreenService()
};
