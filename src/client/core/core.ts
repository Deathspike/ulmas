import * as app from '.';

export const core = {
  api: new app.ApiService(),
  image: new app.ImageService(),
  input: new app.InputService(),
  screen: new app.ScreenService(),
  state: new app.StateService()
};
